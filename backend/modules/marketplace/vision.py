import os
import json
import io
from PIL import Image
from dotenv import load_dotenv
from google import genai

load_dotenv(override=True)

# Bulletproof key loading: completely strips accidental quotes, spaces, or newlines
raw_key = os.getenv("GEMINI_API_KEY", "")
GEMINI_API_KEY = raw_key.strip(' "\'\n\r\t')

async def analyze_waste_image(image_bytes: bytes) -> dict:
    if not GEMINI_API_KEY:
        return {"error": "Gemini API key is missing. Check your .env file."}
    
    # This will print to your VS Code terminal so we can verify the key loaded correctly!
    print(f"\n--- DEBUG INFO ---")
    print(f"Gemini Key Length: {len(GEMINI_API_KEY)}")
    print(f"Gemini Key Starts With: {GEMINI_API_KEY[:6]}")
    print(f"------------------\n")

    # Initialize the new standard Gemini Client
    client = genai.Client(api_key=GEMINI_API_KEY)

    # Convert raw bytes into a Pillow Image
    image = Image.open(io.BytesIO(image_bytes))
    
    prompt = """
    You are an expert recycling logistics AI. Analyze this image of waste materials. 
    Return ONLY a raw JSON object with no markdown formatting, no backticks, and no explanations.
    The JSON must contain exactly these 4 keys:
    - "title": A short descriptive title (e.g., "Pallet of Baled Cardboard")
    - "material_category": The primary material (e.g., "Cardboard", "Plastic", "Wood", "Metal")
    - "condition": The physical state (e.g., "Baled", "Loose", "Crushed")
    - "estimated_weight_kg": An integer representing a rough weight guess in kilograms based on volume.
    """
    
    try:
        # Generate content
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=[image, prompt]
        )
        
        # Clean the output in case Gemini sneaks in markdown backticks
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        
        # Parse it into a Python dictionary
        data = json.loads(clean_text)
        return {"status": "success", "data": data}
        
    except Exception as e:
        # Print the full error to the terminal for deep debugging
        print(f"GEMINI ERROR: {str(e)}")
        return {"status": "error", "message": str(e)}