# Final Cleanup Commands

Run these commands in PowerShell to complete the cleanup process.

## Navigate to Project Root
```powershell
cd "c:\Users\nimra\Documents\PersonalProjects\space-apps-earth-data"
```

## Remove Old Folders (Optional but Recommended)

```powershell
# Remove ai2 folder (all contents have been moved)
Remove-Item -Path "ai2" -Recurse -Force

# Verify it's empty first
Get-ChildItem -Path "ai2"
```

## Clean Cache Files

```powershell
# Remove all Python cache directories
Get-ChildItem -Path . -Recurse -Filter "__pycache__" | Remove-Item -Recurse -Force

# Remove .pyc files
Get-ChildItem -Path . -Recurse -Filter "*.pyc" | Remove-Item -Force
```

## Verify New Structure

```powershell
# Check backend/models contains all model files
Get-ChildItem -Path "backend\models"

# Check ml/notebooks contains all notebooks
Get-ChildItem -Path "ml\notebooks"

# Check data utilities
Get-ChildItem -Path "data"
```

## Create Your .env File

```powershell
# Copy the example to create your .env
Copy-Item -Path ".env.example" -Destination ".env"

# Edit it with your API key
notepad .env
```

Add your actual API key:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

## Test Backend

```powershell
# Activate virtual environment
cd backend
python -m venv venv
.\venv\Scripts\activate

# Install dependencies (including new python-dotenv)
pip install -r requirements.txt

# Start backend server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## Test Frontend

```powershell
# In a new terminal
cd front-end
npm install
npm run dev
```

## Git Commands

```powershell
# Check status
git status

# Add all changes
git add .

# Commit the reorganization
git commit -m "Refactor: Reorganize project structure

- Consolidated data extraction scripts into tempo_data_utils.py
- Moved ML models to backend/models/
- Moved notebooks to ml/notebooks/
- Secured API keys with environment variables
- Added comprehensive documentation
- Updated .gitignore with proper exclusions
- Cleaned up duplicate and empty folders"

# Push changes
git push origin main
```

## Verify Everything Works

1. ✅ Backend starts without errors
2. ✅ Frontend starts and connects to backend
3. ✅ No hardcoded API keys in code
4. ✅ All model files in backend/models/
5. ✅ All notebooks in ml/notebooks/
6. ✅ Documentation is complete
7. ✅ .gitignore excludes sensitive files

## Done! 🎉

Your project is now:
- ✨ Clean and organized
- 🔒 Secure (no exposed API keys)
- 📚 Well documented
- 🤝 Easy for others to contribute to
- 🎯 Following best practices
