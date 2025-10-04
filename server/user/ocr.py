import easyocr
from google import genai
from dotenv import load_dotenv

load_dotenv('../.env')

reader = easyocr.Reader(['en'])

# Run OCR on an image
results = reader.readtext('prescription-template.png')

# Print out detected text
ocr_text = ""
for (bbox, text, prob) in results:
    ocr_text += f"{text} \n"



PRMOMPT = f"""
You are given the OCR text of a prescription. Extract all medicines with their details and return them strictly in a JSON array format.

OCR prescription text:

{ocr_text}


Instructions:
1. 2–3 medicines with names (e.g., Amoxicillin, Paracetamol, Ibuprofen).
2. For each medicine include:
   - **name**: string
   - **description**: string (a detailed description between 15–20 words of what the pill does)
   - **schedule**: a list of times in the format "X_TIME" where:
     - X = day index (0 = Monday, 1 = Tuesday, …, 6 = Sunday)
     - TIME = 24-hour time in 4-digit format (between 0700 and 2400 only)
   - **dosage**: integer (number of pills per intake, not mg)
   - **duration**: integer (number of weeks, between 1–4)
   - **count** = dosage × number of schedule entries × duration × 7
   - **property**: [int (0–2), "rgb(R, G, B)", "rgb(R, G, B)"] with soft pastel RGB colours that are unique per medicine

Output Format:
Return only a valid **JSONArray**, no explanations, no extra text.

Each element must be a JSON object with this structure:
{{
  "name": "string",
  "description": "string",
  "schedule": ["X_0830", "X_2000", ...],
  "dosage": integer,
  "duration": integer,
  "count": integer,
  "property": [int, "rgb(R, G, B)", "rgb(R, G, B)"]
}}
"""

# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash", contents=f'{PRMOMPT}'
)
print(response.text)




