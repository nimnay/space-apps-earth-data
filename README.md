# AeroGuard - Wildfire Response & Air Quality Platform

NASA Space Apps Challenge 2025 - Clemson University

An AI-powered emergency response platform for wildfire and air quality events, combining NASA TEMPO satellite data with real-time incident reporting and evacuation guidance.

## Overview

AeroGuard helps people navigate wildfire and air quality emergencies using NASA's TEMPO satellite data and AI assistance. The platform provides air quality monitoring, incident reporting, and an AI agent that gives personalized emergency guidance.

**Core Features:**
- Wildfire incident reporting system
- Interactive map with air quality data
- AI emergency agent for guidance
- Real-time TEMPO satellite data (NO2, HCHO, O3)
- Air quality predictions using ML models

## Project Structure

```
space-apps-earth-data/
├── backend/
│   ├── main.py           # FastAPI server with AI agent
│   ├── models/           # ML models (NO2 prediction, AQI forecasting)
│   └── requirements.txt
├── front-end/
│   ├── app/
│   │   ├── chat/        # AI assistant
│   │   ├── map/         # Emergency map
│   │   ├── report/      # Incident reporting
│   │   └── aqi-anderson/ # Air quality dashboard
│   └── components/
├── data/
│   └── tempo_data_utils.py  # NASA TEMPO data processing
└── ml/
    └── notebooks/       # Model training
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- NASA Earthdata Account (for TEMPO data)
- Google Gemini API Key (for AI agent)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file in root directory:
```env
GEMINI_API_KEY=your_api_key_here
```

5. Start backend:
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd front-end
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser to `http://localhost:3000`

### Combined Startup

From root directory:
```bash
npm run dev
```

This starts both backend (port 8000) and frontend (port 3000).

## API Endpoints

### Backend (Port 8000)

- `GET /` - Health check
- `POST /predict-no2` - Predict NO2 levels
- `POST /chat` - AeroGuard AI emergency agent
- `POST /report` - Submit incident report (future)
- `GET /incidents` - Get active incidents (future)
- `GET /evacuation-routes` - Get evacuation routes (future)

### Frontend Routes (Port 3000)

- `/` - Home dashboard
- `/map` - Interactive emergency map
- `/chat` - AI assistant
- `/report` - Report incident
- `/aqi-anderson` - Air quality visualization

## Key Technologies

**Backend:**
- FastAPI - API framework
- TensorFlow/Keras - ML models
- Google Generative AI (Gemini) - AI agent
- Pandas & NumPy - Data processing
- xarray & netCDF4 - TEMPO satellite data

**Frontend:**
- Next.js 15 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- D3.js - Data visualization
- Radix UI - UI components

**Data Sources:**
- NASA TEMPO - Satellite air quality data
- OpenAQ - Ground station data
- EONET - Wildfire tracking

## Machine Learning Models

### NO2 Prediction Model
- **Type:** LSTM time series model
- **Input:** 10 previous NO2 measurements
- **Output:** Next NO2 value
- **Purpose:** Predict air quality changes
- **Location:** `backend/models/no2_pred_10_window_newer.keras`

### AQI Forecasting Model
- **Type:** Multi-feature forecasting
- **Purpose:** Predict air quality trends
- **Location:** `backend/models/aqi_forecaster_model.h5`

## NASA TEMPO Data

TEMPO (Tropospheric Emissions: Monitoring of Pollution) provides hourly air quality measurements:
- NO2 (Nitrogen Dioxide)
- HCHO (Formaldehyde)
- O3 (Ozone)

### Working with TEMPO Data

```python
from data.tempo_data_utils import authenticate_earthaccess, search_tempo_data, load_tempo_dataset

# Authenticate
authenticate_earthaccess()

# Search for data
results = search_tempo_data('TEMPO_NO2_L3', count=5)

# Load dataset
dataset = load_tempo_dataset(results, index=0)
```

## Development

### Running Jupyter Notebooks

```bash
cd ml/notebooks
jupyter notebook
```

Available notebooks:
- `data.ipynb` - Data exploration
- `new_stuff.ipynb` - Latest experiments
- `stuff.ipynb` - Model development

### Code Quality

- ESLint for JavaScript/TypeScript
- Python type hints for backend
- Comprehensive .gitignore for security

## Environment Variables

Create `.env` file in root directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional
# DATABASE_URL=postgresql://...
# REDIS_URL=redis://localhost:6379
```

See `.env.example` for template.

## Deployment

### Backend
- Heroku
- Google Cloud Run
- AWS Lambda

### Frontend
- Vercel (recommended)
- Netlify
- AWS Amplify

## Future Development

### Planned Features
- Mobile apps (iOS/Android)
- SMS/Push notifications
- EMS dashboard for first responders
- Multi-language support
- Offline mode
- Live traffic integration
- CAD system integration

## License

ISC

## Contact

**Repository:** [github.com/nimnay/space-apps-earth-data](https://github.com/nimnay/space-apps-earth-data)

## Acknowledgments

- NASA - TEMPO satellite data and EONET wildfire tracking
- NASA Space Apps Challenge 2025
- Clemson University
- OpenAQ - Air quality data
- Google Gemini AI - Emergency agent capabilities

---

Built to help people stay safe during wildfire and air quality emergencies.
