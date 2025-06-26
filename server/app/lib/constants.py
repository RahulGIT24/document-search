from dotenv import load_dotenv
import os
load_dotenv()

MONGODB_URL=os.getenv('MONGODB_URL')
DB_NAME=os.getenv('DB_NAME')
JWT_SECRET=os.getenv("SECRET")
EMAIL_ADDRESS=os.getenv('EMAIL_ADDRESS')
EMAIL_PASSWORD=os.getenv('EMAIL_PASSWORD')
BACKEND_URL=os.getenv('BACKEND_URL')
QDRANT_HOST=os.getenv('QDRANT_HOST')
QDRANT_PORT=os.getenv('QDRANT_PORT')
QDRANT_COLLECTION_NAME=os.getenv('QDRANT_COLLECTION_NAME')
QDRANT_URL=os.getenv('QDRANT_URL')
LLM_API_KEY=os.getenv('LLM_API_KEY')
FRONTEND_URL=os.getenv('FRONTEND_URL')