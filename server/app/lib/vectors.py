from typing import List
from qdrant_client import QdrantClient
from lib.constants import QDRANT_HOST,QDRANT_PORT,QDRANT_COLLECTION_NAME,QDRANT_URL
from langchain.schema import Document
from langchain_community.embeddings import FastEmbedEmbeddings
# from qdrant_client.models import VectorParams,Distance
from langchain_qdrant import Qdrant
import uuid

def store_in_vec_db(pdf_id:str,chunks:List[str]):
    try:
        documents = [Document(
            page_content=chunk,
            metadata={"pdf_id": pdf_id, "chunk_id": str(uuid.uuid4())}
        ) for chunk in chunks]

        embedding_model = FastEmbedEmbeddings()

        vectorstore=Qdrant.from_documents(
            documents=documents,
            embedding=embedding_model,
            url=QDRANT_URL,
            collection_name=QDRANT_COLLECTION_NAME
        )

        check=vectorstore.add_documents(documents)
        print(check)

        return True

    except Exception as e:
        print(e)
        print('An exception occurred')
        return False