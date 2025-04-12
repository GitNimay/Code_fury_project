from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import ollama
from pypdf import PdfReader  # Using pypdf instead of PyMuPDF

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from your frontend

# Define upload folder and create it if it doesn't exist
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file using pypdf."""
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text + "\n"
    except Exception as e:
        print("Error extracting text from PDF:", e)
    return text.strip()

def clean_questions(output_text):
    """Cleans and formats the generated interview questions."""
    questions = []
    lines = output_text.split("\n")

    for line in lines:
        line = line.strip()
        if line and "**" not in line:
            questions.append(line.lstrip("0123456789.- "))  # Remove numbering and dashes

    return questions[:7]  # Ensure exactly 7 questions

def generate_interview_questions(resume_text):
    """
    Uses the local Llama model (via Ollama) to generate 7 direct interview questions.
    """
    prompt = (
        f"Generate exactly 7 direct interview questions strictly based on the resume content.\n"
        f"Do NOT include any introductory text, numbering, or explanations—only the questions.\n"
        f"Resume Content:\n{resume_text}\n"
        f"Interview Questions:"
    )
    
    try:
        # Call the locally installed Llama model using Ollama
        response = ollama.chat(model="llama3", messages=[{"role": "user", "content": prompt}])
        output_text = response.get("message", {}).get("content", "")
        return clean_questions(output_text)
    except Exception as e:
        print("Error calling Ollama:", e)
        return ["Failed to generate questions."]

@app.route("/upload-resume", methods=["POST"])
def upload_resume():
    # Ensure a resume file is included
    if "resume" not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    
    resume_file = request.files["resume"]
    if resume_file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    
    # Save the uploaded resume
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], resume_file.filename)
    resume_file.save(file_path)
    
    # Extract text from the PDF resume
    resume_text = extract_text_from_pdf(file_path)
    if not resume_text:
        return jsonify({"error": "Failed to extract text from resume"}), 500

    # Generate interview questions using Ollama
    questions = generate_interview_questions(resume_text)
    
    return jsonify({"questions": questions})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
