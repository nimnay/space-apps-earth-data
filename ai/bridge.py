import sys
import os
import traceback
import locale
from pathlib import Path
from dotenv import load_dotenv
from gemini_wrapper import AeroGuardAI

# Set UTF-8 encoding for stdout
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8')

# Try to load .env from different possible locations
env_locations = [
    Path(__file__).parent.parent / '.env',  # Project root
    Path(__file__).parent.parent / 'front-end' / '.env',  # Frontend directory
]

for env_file in env_locations:
    if env_file.exists():
        load_dotenv(env_file)
        print(f"Loaded .env from {env_file}", file=sys.stderr)
        break

def main():
    try:
        # Debug information
        print(f"Python executable: {sys.executable}", file=sys.stderr)
        print(f"Working directory: {os.getcwd()}", file=sys.stderr)
        print(f"Command line arguments: {sys.argv}", file=sys.stderr)
        
        # Validate arguments
        if len(sys.argv) < 3:
            raise ValueError("Missing required arguments: mode and message")

        # Get and validate inputs
        mode = sys.argv[1].strip()
        message = sys.argv[2].strip()
        
        if mode not in ["wildfire", "pollution"]:
            raise ValueError(f"Invalid mode: {mode}. Must be 'wildfire' or 'pollution'")
        
        print(f"Processing: Mode={mode}, Message={message}", file=sys.stderr)

        # Initialize AI and get response
        ai = AeroGuardAI()
        
        if mode == "wildfire":
            response = ai.get_wildfire_advice("Upstate SC", message)
        else:
            location = "Upstate SC"
            activity = message
            response = ai.get_pollution_advice(location, activity)
        
        # Handle response encoding safely
        try:
            # Try to encode and decode to ensure it's valid UTF-8
            encoded_response = response.strip().encode('utf-8', errors='replace')
            decoded_response = encoded_response.decode('utf-8')
            print(decoded_response)
            sys.exit(0)
        except Exception as encode_error:
            print(f"Error encoding response: {str(encode_error)}", file=sys.stderr)
            # Fallback to ASCII-only response
            safe_response = response.encode('ascii', errors='replace').decode('ascii')
            print(safe_response)
            sys.exit(0)
        
    except Exception as e:
        error_msg = f"Error: {str(e)}\n{traceback.format_exc()}"
        print(error_msg, file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()