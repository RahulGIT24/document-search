import fitz
from langchain_text_splitters import RecursiveCharacterTextSplitter

def get_text_chunks(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    full_text = ""

    for page in doc:
        blocks = page.get_text("blocks", sort=True)
        sorted_blocks = sorted(blocks, key=lambda b: (b[1], b[0]))

        for block in sorted_blocks:
            text = block[4]
            if text.strip():
                full_text += text.strip() + "\n\n"

    doc.close()
    return convert_text_to_chunks(full_text.strip())

def convert_text_to_chunks(text:str):
    text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
    )
    chunks = text_splitter.split_text(text)
    return chunks

if __name__ == '__main__':
    print(get_text_chunks('public/Assignment.pdf'))