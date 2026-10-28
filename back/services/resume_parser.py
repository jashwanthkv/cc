import io
import pdfplumber


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract all text from a PDF file given its raw bytes."""
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text.strip())
    return "\n\n".join(text_parts)


def extract_text_from_txt(file_bytes: bytes) -> str:
    """Decode plain text file bytes."""
    return file_bytes.decode("utf-8", errors="ignore").strip()


def parse_resume(file_bytes: bytes, filename: str) -> str:
    """Auto-detect format and extract resume text."""
    fname = filename.lower()
    if fname.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif fname.endswith((".txt", ".md")):
        return extract_text_from_txt(file_bytes)
    else:
        # Attempt PDF first, fall back to text
        try:
            return extract_text_from_pdf(file_bytes)
        except Exception:
            return extract_text_from_txt(file_bytes)
