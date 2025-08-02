# 📚 PDF Chat App

A powerful **AI-powered PDF Reader and Chat application** that allows users to **upload PDFs, extract content, and chat with them like ChatGPT**. It integrates **FastAPI**, **Qdrant**, **LangChain**, and **Gemini LLM** for semantic search and context-aware responses, while **Redis caching** ensures fast retrieval and **MongoDB (Beanie ODM)** stores user data and chats.

---

## Demo Video
[![Watch the video](/demo/cover.png)](https://drive.google.com/file/d/1PXVuuEgv2Zpym2RDDykjeo9Q845mAfxN/view?usp=sharing)

## 🚀 Features

- ✅ **Upload PDFs** – Upload and manage multiple PDFs.  
- ✅ **Chat with Documents** – Ask context-based questions and get instant answers.  
- ✅ **Chat Session Management** – Create multiple sessions like ChatGPT.  
- ✅ **View Uploaded Files** – Access and manage all your PDFs.  
- ✅ **LLM-Powered Responses** – Uses **Google Gemini** for refined context understanding.  
- ✅ **Semantic Search** – Uses **Qdrant Vector DB** for similarity-based retrieval.  
- ✅ **Caching with Redis** – Stores frequently asked queries and chat sessions for fast response.  

---

## 🛠 Tech Stack

### **Frontend**
- **React** + **Tailwind CSS**

### **Backend**
- **FastAPI** – High-performance Python web framework  
- **LangChain** – Handles LLM and embedding logic  
- **Gemini (Google Generative AI)** – LLM for contextual responses  
- **Qdrant** – Vector database for semantic search  
- **Beanie** – ODM for MongoDB (async)  
- **MongoDB** – Stores sessions and user data  
- **Redis** – For caching sessions and queries  

---

## 📂 How It Works

1. **PDF Upload** → Frontend sends PDF to FastAPI backend.  
2. **Text Extraction** → PDF content parsed into text chunks.  
3. **Embedding Generation** → LangChain creates embeddings for chunks.  
4. **Store in Qdrant** → Embeddings stored for semantic similarity search.  
5. **User Query** → Retrieves relevant chunks from Qdrant.  
6. **LLM Refinement** → Gemini processes context and returns the final response.  
7. **Caching** → Redis stores recent queries and chat sessions for faster retrieval.  

---

## 🔧 Installation & Setup

### **Clone the Repository**
```bash
git clone https://github.com/RahulGIT24/document-search
cd document-search/server
```
### **Install `uv` package manager**
```bash
pip install uv
```
### **Install Dependencies**
```bash
uv sync
```
### **Environment Variables**
Create a `.env` file take reference from `.env.sample`

### **Run the Application**
```bash
uv run app/main.py
```