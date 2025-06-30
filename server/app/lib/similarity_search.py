from typing import List
from langchain_google_genai import GoogleGenerativeAI
from lib.qdrant import qdrant_client
from lib.constants import QDRANT_COLLECTION_NAME, LLM_API_KEY
from fastembed.embedding import DefaultEmbedding
from qdrant_client.models import Filter, FieldCondition, MatchValue, SearchParams

def perform_similarity_search(pdfids: List[str], content: str):
    try:
        # ✅ Step 1: Embed the query
        embedder = DefaultEmbedding()
        vector = list(embedder.embed([content]))[0]

        # ✅ Step 2: Similarity search with filter on pdf_ids
        pdf_id_conditions = [
            FieldCondition(
                key="metadata.pdf_id",
                match=MatchValue(value=pdfid)
            )
            for pdfid in pdfids
        ]

        hits = qdrant_client.search(
            collection_name=QDRANT_COLLECTION_NAME,
            query_vector=vector,
            limit=3,
            query_filter=Filter(
                must=[
                    Filter(
                        should=pdf_id_conditions,
                        must_not=[]
                    )
                ]
            ),
            search_params=SearchParams(hnsw_ef=128)
        )

        # ✅ Step 3: Extract context chunks
        context_chunks = [hit.payload.get("page_content", "") for hit in hits]

        # ✅ Step 4: Format context into a prompt
        context = "\n\n".join(context_chunks)
        prompt = f"""You are answering a user question based on content from selected PDFs.

    Context:
    {context}

    Question:
    {content}

    Answer:"""

        # ✅ Step 5: Use Gemini for final answer
        llm = GoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=LLM_API_KEY)
        response = llm.invoke(prompt)

        return response
    except:
        return False