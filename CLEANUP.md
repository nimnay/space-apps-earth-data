# Cleanup Recommendations

## Files/Folders to Consider Removing

### 1. Empty or Redundant Folders
- `ai/` - Empty folder (only contains __pycache__)
- `ai2/` - Contents moved to `ml/notebooks/` and `backend/models/`

### 2. Duplicate Scripts (already consolidated)
- `ai2/data_extract.py` - Consolidated into `data/tempo_data_utils.py`
- `data/extract_data.py` - Functions available in `data/tempo_data_utils.py`
- `data/scratch.py` - Utility script (inspect NetCDF), can be removed if not needed

### 3. Cache and Build Artifacts
These should already be ignored by .gitignore:
- `__pycache__/` folders (Python bytecode)
- `.next/` (Next.js build)
- `node_modules/` (npm packages)

### 4. Large Model Files
Consider using Git LFS or keeping only in production:
- `*.h5` files (model weights)
- `*.keras` files (saved models)
- `*.pkl` files (pickled models)
- `*.nc` files (NetCDF satellite data)
- `*.csv` files (large datasets)

## Recommended Actions

### PowerShell Commands to Clean Up:

```powershell
# Remove empty ai folder
Remove-Item -Path "ai" -Recurse -Force

# Remove ai2 folder (contents already moved)
Remove-Item -Path "ai2" -Recurse -Force

# Optional: Remove old scripts if consolidated successfully
# Remove-Item -Path "data\scratch.py" -Force

# Clean Python cache files
Get-ChildItem -Path . -Recurse -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Path . -Recurse -Filter "*.pyc" | Remove-Item -Force
Get-ChildItem -Path . -Recurse -Filter "*.pyo" | Remove-Item -Force

# Clean Node.js cache (if needed)
# Remove-Item -Path "front-end\node_modules" -Recurse -Force
# Remove-Item -Path "front-end\.next" -Recurse -Force
```

### Git Commands:

```bash
# After cleanup, commit the changes
git add .
git commit -m "Refactor: Reorganize project structure and consolidate files"

# Optional: Remove files from git history (if they're large)
# git rm --cached backend/models/*.h5
# git rm --cached backend/models/*.keras
```

## New Organized Structure

```
space-apps-earth-data/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── models/           # All ML models here
├── data/
│   ├── tempo_data_utils.py  # Consolidated data utilities
│   └── tempo_no2_data.csv
├── ml/
│   └── notebooks/        # All Jupyter notebooks
├── front-end/            # Next.js app (unchanged)
├── .env                  # Your secrets (not in git)
├── .env.example          # Template for others
├── .gitignore           # Comprehensive ignore rules
└── README.md            # Complete documentation
```

## Notes

- Keep notebooks in `ml/notebooks/` for reference and experimentation
- Model files in `backend/models/` should be documented in README
- Data utilities are now in `data/tempo_data_utils.py` with proper documentation
- All sensitive API keys are now in environment variables
