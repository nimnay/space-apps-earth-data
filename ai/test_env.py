import os
from dotenv import load_dotenv
import google.generativeai as genai
from pathlib import Path

def test_env():
    print("1. Testing environment setup...")
    print(f"Current directory: {os.getcwd()}")
    print(f"Python executable: {sys.executable}")
    
    print("\n2. Testing .env file...")
    env_file = Path('../.env')
    if not env_file.exists():
        print(f"ERROR: .env file not found at {env_file.absolute()}")
        return
    
    load_dotenv(env_file)
    api_key = os.getenv('GEMINI_API_KEY')
    print(f"API key found: {'Yes' if api_key else 'No'}")
    
    print("\n3. Testing Gemini API connection...")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro-latest')
        response = model.generate_content("Hello!")
        print("Gemini API test response:", response.text)
        print("\nAll tests passed!")
    except Exception as e:
        print(f"Error testing Gemini API: {str(e)}")

if __name__ == "__main__":
    import sys
    test_env()