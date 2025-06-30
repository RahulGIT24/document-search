from typing import List
from lib.constants import QDRANT_COLLECTION_NAME,QDRANT_URL
from langchain.schema import Document
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_qdrant import Qdrant
from qdrant_client.models import Filter, FieldCondition, MatchValue
import uuid
from lib.qdrant import qdrant_client

def store_in_vec_db(pdf_id:str,chunks:List[str]):
    try:
        documents = [Document(
    page_content=chunk,
    metadata={
        "pdf_id": pdf_id,
        "chunk_id": str(uuid.uuid4()),
        "source": "user_upload"
    }
) for chunk in chunks]

        embedding_model = FastEmbedEmbeddings()

        vectorstore=Qdrant.from_documents(
            documents=documents,
            embedding=embedding_model,
            url=QDRANT_URL,
            collection_name=QDRANT_COLLECTION_NAME
        )

        vectorstore.add_documents(documents)

        return True

    except Exception as e:
        print(e)
        return False

def delete_from_vector(pdfid:str):
    qdrant_client.delete(
        collection_name=QDRANT_COLLECTION_NAME,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key='pdf_id',
                    match=MatchValue(value=pdfid)
                )
            ]
        )
    )