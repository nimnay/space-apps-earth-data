# Space Apps Earth Data - Air Quality Monitoring Platform

A comprehensive air quality monitoring and prediction platform using NASA TEMPO satellite data, machine learning, and real-time visualization.

## 🌍 Project Overview

This project leverages NASA's TEMPO (Tropospheric Emissions: Monitoring of Pollution) satellite data to monitor and predict air quality across North America, with a focus on NO2, HCHO, and O3 levels. The platform combines machine learning models with real-time data visualization and an AI-powered chatbot assistant.

## 🏗️ Project Structure

```
space-apps-earth-data/
├── backend/               # FastAPI backend server
│   ├── main.py           # API endpoints and ML model serving
│   ├── models/           # Trained ML models (.keras, .h5, .pkl)
│   └── requirements.txt  # Python dependencies
├── front-end/            # Next.js frontend application
│   ├── app/              # Next.js app directory
│   │   ├── api/         # API routes
│   │   ├── chat/        # AI chatbot interface
│   │   ├── map/         # Interactive map view
│   │   └── report/      # Reporting interface
│   ├── components/       # React components
│   └── public/          # Static assets
├── data/                 # Data processing scripts
│   ├── tempo_data_utils.py  # TEMPO data extraction utilities
│   ├── extract_data.py      # NetCDF to CSV converter
│   └── tempo_no2_data.csv   # Processed data
├── ml/                   # Machine learning development
│   └── notebooks/       # Jupyter notebooks for ML experiments
└── .env                 # Environment variables (not in git)
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** (for backend and data processing)
- **Node.js 18+** and npm (for frontend)
- **NASA Earthdata Account** (for TEMPO data access)
- **Google Gemini API Key** (for AI chatbot)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Start the backend server:**
   ```bash
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd front-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Combined Startup (from root)

```bash
npm run dev
```

This will start both the backend (port 8000) and frontend (port 3000).

## 🔑 API Keys Setup

### NASA Earthdata Login

1. Register at [NASA Earthdata](https://urs.earthdata.nasa.gov/users/new)
2. Create a `.netrc` file in your home directory with your credentials
3. The `earthaccess` library will use these credentials automatically

### Google Gemini API

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

## 📊 Data Processing

### Extracting TEMPO Satellite Data

```python
from data.tempo_data_utils import authenticate_earthaccess, search_tempo_data, load_tempo_dataset

# Authenticate with NASA Earthdata
authenticate_earthaccess()

# Search for NO2 data
results = search_tempo_data('TEMPO_NO2_L3', count=5)

# Load and process
dataset = load_tempo_dataset(results, index=0)
```

### Converting NetCDF to CSV

```python
from data.tempo_data_utils import extract_netcdf_to_csv

df = extract_netcdf_to_csv(
    input_file='TEMPO_NO2_L2_V03_20240717T232209Z_S015G06.nc',
    output_csv='tempo_no2_data.csv'
)
```

## 🤖 API Endpoints

### Backend API (Port 8000)

- **GET** `/` - Health check
- **POST** `/predict-no2` - Predict NO2 levels
  ```json
  {
    "values": [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1]
  }
  ```
- **POST** `/chat` - AI chatbot for air quality advice

### Frontend API Routes (Port 3000)

- `/api/ai` - AI assistant interface
- `/api/openaq` - OpenAQ data integration
- `/api/report` - Air quality reporting

## 🧪 Machine Learning Models

### NO2 Prediction Model

- **Type:** LSTM/Time Series
- **Input:** 10 previous NO2 measurements
- **Output:** Next NO2 value prediction
- **Location:** `backend/models/no2_pred_10_window_newer.keras`

### AQI Forecasting Model

- **Type:** Multi-feature forecasting
- **Location:** `backend/models/aqi_forecaster_model.h5`

## 🛠️ Technologies Used

### Backend
- **FastAPI** - Modern Python web framework
- **TensorFlow/Keras** - Machine learning models
- **Google Generative AI** - AI chatbot
- **Pandas & NumPy** - Data processing
- **xarray & netCDF4** - Satellite data processing

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **D3.js** - Data visualization
- **Radix UI** - Accessible component primitives

## 📝 Development

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

The project uses:
- **ESLint** for JavaScript/TypeScript linting
- **Python type hints** for backend type safety
- **Prettier** (recommended) for code formatting

## 🌐 Deployment

### Backend Deployment

The backend can be deployed to:
- **Heroku** - Using `Procfile`
- **Google Cloud Run** - Containerized deployment
- **AWS Lambda** - Serverless deployment

### Frontend Deployment

The Next.js app is optimized for deployment on:
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**

## 📄 License

ISC

## 🤝 Contributing

This is a NASA Space Apps Challenge project. For contributions, please follow standard GitHub flow:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Contact

Repository: [github.com/nimnay/space-apps-earth-data](https://github.com/nimnay/space-apps-earth-data)

## 🙏 Acknowledgments

- **NASA** - For TEMPO satellite data
- **Space Apps Challenge** - For the opportunity
- **OpenAQ** - For air quality data API
- **Google Gemini** - For AI capabilities
