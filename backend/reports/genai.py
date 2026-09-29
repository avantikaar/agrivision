import json
import re
from pathlib import Path
from django.conf import settings

from google import genai
from PIL import Image

# Initialize the new client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

# New Gemini model (1.5 was retired)
MODEL_NAME = "gemini-2.5-flash"


def detect_disease(image_path: str) -> dict:
    """
    Analyze a leaf image and return {disease, confidence, crop}.
    """
    image = Image.open(image_path)

    prompt = """You are an agricultural expert analyzing a crop leaf image.

Return ONLY a JSON object with these exact keys:
{
  "disease": "the disease name, or 'Healthy' if the leaf looks healthy, or 'Unknown' if unclear",
  "confidence": a number between 0 and 1 representing your confidence,
  "crop": "the crop type if identifiable, else 'Unknown'"
}

Do not include any other text, explanation, or markdown formatting.
Only the JSON object."""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=[prompt, image],
    )
    text = response.text.strip()

    # Extract JSON from possible markdown wrapping
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if not match:
        return {"disease": "Unknown", "confidence": 0.0, "crop": "Unknown"}

    try:
        data = json.loads(match.group())
        return {
            "disease": str(data.get("disease", "Unknown")),
            "confidence": float(data.get("confidence", 0.0)),
            "crop": str(data.get("crop", "Unknown")),
        }
    except (json.JSONDecodeError, ValueError):
        return {"disease": "Unknown", "confidence": 0.0, "crop": "Unknown"}


def generate_treatment(disease: str, crop: str, language: str = "en") -> str:
    """
    Generate a treatment plan in the farmer's preferred language.
    """
    language_map = {
        "en": "English", "hi": "Hindi", "kn": "Kannada", "ta": "Tamil"
    }
    lang_name = language_map.get(language, "English")

    prompt = f"""A farmer growing {crop} has been told their crop has: {disease}.

Write a treatment plan in {lang_name}. Include:
1. One sentence describing what this is in simple terms.
2. Immediate action with specific chemical or organic treatment and dosage.
3. Preventive measures for next season.

Keep it under 120 words. Use simple, practical language. No markdown."""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )
    return response.text.strip()