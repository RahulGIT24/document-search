from qdrant_client import QdrantClient
from lib.constants import QDRANT_HOST,QDRANT_PORT,QDRANT_COLLECTION_NAME
from qdrant_client.models import VectorParams,Distance


qdrant_client = QdrantClient(host=QDRANT_HOST,port=QDRANT_PORT)
# qdrant_client.recreate_collection(collection_name=QDRANT_COLLECTION_NAME,vectors_config=VectorParams(size=384,distance=Distance.COSINE),force_recreate=True)