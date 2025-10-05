import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Configure the API
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key found: {'Yes' if api_key else 'No'}")

try:
    # Configure the library
    genai.configure(api_key=api_key)
    
    # List available models
    print("\nAvailable models:")
    for m in genai.list_models():
        print(f"- {m.name}")
    
    # Try a simple generation
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say hello!")
    print("\nTest response:")
    print(response.text)
    
except Exception as e:
    print(f"\nError occurred: {str(e)}")