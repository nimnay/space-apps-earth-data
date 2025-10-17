# AeroGuard - Wildfire Response & Air Quality Emergency Platform

### NASA Space Apps Challenge 2025 - Winner of "Global Impact" at Clemson University

An AI-powered emergency response platform for wildfire and air quality events, combining NASA TEMPO satellite data, real-time incident reporting, evacuation guidance, and an intelligent agent that helps people navigate emergency situations.

## 🚨 Project Overview

**AeroGuard** is a comprehensive wildfire response and air quality emergency platform designed to save lives during environmental disasters. Using NASA's TEMPO (Tropospheric Emissions: Monitoring of Pollution) satellite data combined with real-time event reporting, the platform provides:

- 🔥 **Wildfire Event Reporting** - Report and track wildfire incidents in real-time
- 🗺️ **Interactive Emergency Map** - View wildfires, smoke patterns, and air quality on an interactive map
- 🚗 **Evacuation Guidance** - Get nearest evacuation routes and safe zones
- 🤖 **AI Emergency Agent** - AeroGuard AI assistant provides personalized guidance for navigating dangerous situations
- 🏥 **EMS Integration** (Future) - Emergency Medical Services view for first responders
- 📊 **Air Quality Monitoring** - Real-time NO2, HCHO, and O3 levels from TEMPO satellite
- 🔮 **Predictive Analytics** - ML models forecast air quality changes and smoke movement

## � Detailed Features

### 1. 🔥 Wildfire Incident Reporting System

**What it does:** Allows anyone to report wildfire events they observe in real-time

**Features:**
- Quick incident reporting form (`/report`)
- GPS location tagging with map picker
- Severity classification (minor/moderate/severe)
- Photo/description upload for documentation
- Real-time validation and verification
- Community alerts for nearby residents

**User Flow:**
1. Citizen observes smoke or fire
2. Opens `/report` page on phone/desktop
3. Fills in location, severity, and details
4. Optionally uploads photo
5. Submits report to database
6. Incident appears on emergency map immediately
7. Nearby residents receive alerts
8. Emergency managers can triage and respond

---

### 2. 🗺️ Interactive Emergency Map

**What it does:** Visualizes real-time wildfire incidents, air quality, and evacuation routes on an interactive map

**Map Layers:**
- 🔥 **Active wildfire locations** - Red markers for reported incidents
- 🌬️ **Smoke plume overlay** - Real-time data from TEMPO NO2/HCHO measurements
- 📊 **Air quality heatmap** - Color-coded AQI zones (green/yellow/orange/red)
- 🚗 **Evacuation routes** - Highlighted safe paths to exit danger zones
- ✅ **Safe zones & shelters** - Emergency shelters, capacity, pet-friendly status
- 🏥 **Medical facilities** - Hospitals and urgent care locations
- 🚧 **Road closures** - Blocked roads due to fire or smoke

**Interactive Features:**
- Click any incident for full details
- Get turn-by-turn directions to nearest safe zone
- View current air quality at any map point
- Toggle data layers on/off
- Real-time updates every 60 seconds
- Mobile-responsive with pinch-to-zoom

**Technology:**
- D3.js for advanced data visualization
- NASA TEMPO satellite data overlay
- OpenAQ ground station integration
- Leaflet/Mapbox for base maps (future)

---

### 3. 🤖 AeroGuard AI Emergency Agent

**What it does:** Provides personalized, location-specific emergency guidance through natural conversation

**Agent Capabilities:**

#### Wildfire Emergency Response
```
User: "I'm in Anderson and there's a wildfire nearby, what should I do?"

AeroGuard AI: 
🚨 SMOKE ALERT: Anderson, SC

IMMEDIATE ACTIONS:
- Close all windows and doors NOW
- Turn AC to recirculate mode (not fresh air)
- Gather emergency supplies (meds, documents, water)
- Monitor local emergency alerts

EVACUATION PLAN:
✅ Safe route: Highway 28 West toward Clemson
✅ Nearest shelter: Clemson Elementary School (10 miles, pet-friendly)
⏰ Recommend leaving within 30 minutes if smoke worsens

HEALTH PRECAUTIONS:
- Stay indoors for next 4 hours minimum
- Use N95 masks if you must go outside
- Asthma patients: Keep rescue inhaler accessible
- Elderly/children: Avoid all outdoor exposure

TIMELINE: Smoke expected to clear by 6 PM based on current wind patterns
```

#### Air Quality Guidance
- Real-time AQI interpretation and health impacts
- Activity recommendations ("Can I go running today?")
- Vulnerable group protection (children, elderly, asthma, COPD)
- Indoor air quality improvement tips
- Safe return timeline ("When can I go back home?")

#### Location-Specific Intelligence
- **Upstate South Carolina focus** - Deep knowledge of the region
- Names actual towns, roads, and landmarks
- Considers local geography, wind patterns, topography
- Provides specific shelter locations with addresses
- Knows evacuation routes for each area

**Powered by:**
- Google Gemini 2.5 Flash AI
- Custom emergency response prompting
- Real-time TEMPO satellite data integration
- Historical air quality patterns

---

### 4. 🚗 Evacuation Guidance System

**What it does:** Helps people safely evacuate from wildfire danger zones

**Route Planning:**
- Calculates fastest AND safest evacuation routes
- Avoids active fire zones and heavy smoke areas
- Considers real-time traffic conditions
- Alternative routes if primary is blocked
- Turn-by-turn navigation integration

**Shelter Information:**
- Nearest shelter locations with addresses
- Current capacity and availability status
- Pet-friendly facilities highlighted
- Accessible options (wheelchair ramps, medical equipment)
- Special needs accommodations
- Contact numbers for each shelter

**Timeline Predictions:**
- **Evacuate NOW** - Immediate danger level
- **Prepare to evacuate** - Monitor situation closely
- **Shelter in place** - Safer to stay indoors temporarily
- **Safe to return** - Based on ML-predicted air quality improvement

**Implementation:**
- Uses NO2 prediction LSTM model to forecast smoke movement
- Integrates with interactive map component
- API endpoint: `GET /evacuation-routes?lat={lat}&lon={lon}`
- Mobile-first responsive design

---

### 5. 📊 Real-Time Air Quality Monitoring

**What it does:** Displays current, historical, and predicted air quality data

**Data Sources:**
- **NASA TEMPO Satellite** - NO2, HCHO, O3 measurements every hour
- **OpenAQ Network** - Ground station validation data
- **ML Predictions** - Forecasted air quality for next 4-24 hours

**Visualizations:**
- Real-time AQI dashboard (`/aqi-anderson`)
- Historical trend charts (past 7 days)
- Forecast charts with confidence intervals
- Regional comparison maps
- Pollutant breakdowns (NO2 vs HCHO vs O3)

**Health Recommendations:**
- Color-coded AQI levels (Green=Good, Red=Unhealthy)
- Activity suggestions for each AQI level
- Vulnerable group warnings
- Mask recommendations
- When to seek medical attention

**Use Cases:**
- Decide if it's safe to go outside today
- Plan outdoor activities (sports, gardening)
- Track improvement after wildfire containment
- Validate evacuation timing decisions
- Long-term health impact assessment

---

### 6. 🏥 EMS Dashboard (Future Development)

**What it does:** Emergency Medical Services and first responder command center

**Planned Features:**

#### Incident Command Center
- All active incidents displayed on unified dashboard
- Priority levels (P1=critical, P2=urgent, P3=routine)
- Severity indicators and casualty counts
- Resource allocation AI recommendations
- Multi-agency coordination tools

#### First Responder Safety
- Real-time air quality at incident location
- Safe approach routes avoiding smoke
- PPE requirements (respirators, protective gear)
- Hazard warnings (wind shifts, fire spread)
- Escape route planning

#### Resource Management
- Track ambulances, fire trucks, personnel
- Optimize deployment based on incident proximity
- Equipment availability (masks, oxygen, stretchers)
- Mutual aid coordination with neighboring departments
- Hospital bed availability status

#### Integration Capabilities
- CAD (Computer-Aided Dispatch) systems
- 911 emergency call centers
- Hospital emergency departments
- FEMA emergency management systems
- Weather service alerts

**Access Control:**
- EMS/Fire Department login required
- Role-based permissions (dispatcher, paramedic, commander)
- HIPAA compliant for medical data
- Audit logging for accountability

---

## 👥 Who Uses AeroGuard?

### 🏡 Citizens & Residents
**Scenario:** Sarah sees smoke from her home in Anderson, SC

**How AeroGuard helps:**
1. Reports the incident via `/report` form
2. Checks `/map` to see fire locations and air quality
3. Chats with AI: "Should I evacuate?"
4. Gets personalized guidance and evacuation route
5. Receives shelter location with pet-friendly confirmation

**Outcome:** Makes informed decision quickly, evacuates safely with family and pets

---

### 👔 Emergency Managers
**Scenario:** David (County Emergency Manager) receives wildfire alert

**How AeroGuard helps:**
1. Views all incidents on centralized dashboard
2. Assesses air quality data from TEMPO satellite
3. Identifies affected population areas
4. Uses ML predictions to forecast smoke spread
5. Coordinates evacuation orders for high-risk zones

**Outcome:** Efficient resource deployment, timely evacuations, lives saved

---

### 😷 Vulnerable Populations
**Scenario:** Maria has asthma, needs to know if outdoor air is safe

**How AeroGuard helps:**
1. Checks real-time AQI on `/aqi-anderson`
2. Chats with AI: "Is it safe for me to go outside with asthma?"
3. Gets personalized health guidance
4. Receives timeline for when air quality will improve

**Outcome:** Avoids asthma attack, stays safe indoors until air clears

---

### 🚒 First Responders (Future)
**Scenario:** Firefighter John responding to wildfire call

**How AeroGuard helps:**
1. Accesses EMS dashboard before deployment
2. Checks air quality and wind patterns at scene
3. Plans safest approach route
4. Ensures proper PPE for crew

**Outcome:** Safe response with appropriate protection equipment

---

## �️ Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       USERS                             │
│  👤 Citizens  |  🚒 First Responders  |  👔 Managers    │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
    ┌────▼─────┐          ┌──────▼───────┐
    │ Next.js  │          │   FastAPI    │
    │ Frontend │◄────────►│   Backend    │
    │ Port 3000│   REST   │  Port 8000   │
    └────┬─────┘          └──────┬───────┘
         │                       │
         │                ┌──────┴───────┐
         │                │              │
         │           ┌────▼───┐     ┌───▼─────┐
         │           │   ML   │     │ Gemini  │
         │           │ Models │     │   AI    │
         │           │ (LSTM) │     │ Agent   │
         │           └────────┘     └─────────┘
         │
    ┌────▼──────────────────────────┐
    │      Data Sources             │
    ├───────────────────────────────┤
    │ • NASA TEMPO Satellite        │
    │ • OpenAQ Ground Stations      │
    │ • EONET Wildfire Tracking     │
    │ • User-Reported Incidents     │
    │ • Weather Service APIs        │
    └───────────────────────────────┘
```

### Key Components:

**Frontend (Next.js + TypeScript)**
- Server-side rendering for fast load times
- Real-time map updates via WebSocket (future)
- Mobile-responsive emergency UI
- Offline mode for connectivity loss (future)

**Backend (FastAPI + Python)**
- RESTful API endpoints
- ML model serving (TensorFlow)
- NASA TEMPO data ingestion pipeline
- Incident database management
- Real-time alert generation

**AI Agent (Google Gemini)**
- Natural language understanding
- Context-aware emergency responses
- Location-specific guidance
- Multi-turn conversation support

**Data Pipeline**
- Hourly TEMPO satellite data pulls
- OpenAQ ground station sync
- EONET wildfire event monitoring
- User incident aggregation

---

## 📱 User Interface Pages

### `/` - Home Dashboard
- Current alerts and active warnings
- Quick action buttons (Report Incident, View Map, Chat AI)
- Nearby air quality status widget
- Recent incidents in your area

### `/map` - Interactive Emergency Map
- Full-screen map with all data layers
- Incident markers (click for details)
- Air quality heat overlay
- Evacuation route visualization
- Safe zone indicators
- Real-time updates

### `/chat` - AI Assistant
- Chat interface with AeroGuard AI
- Pre-filled emergency prompts
- Location-based suggestions
- Conversation history
- Voice input (future)

### `/report` - Incident Reporting
- Quick report form
- GPS location auto-fill
- Map picker for precise location
- Photo upload capability
- Severity selector
- Optional contact information

### `/aqi-anderson` - Air Quality Dashboard
- Real-time AQI gauge
- Historical trend charts (7 days)
- Forecast predictions (24 hours)
- Pollutant breakdown (NO2, HCHO, O3)
- Health recommendations
- Download data as CSV

---

## 🎯 Success Metrics

### Lives Saved & Safety
- ✅ Faster evacuation decisions (target: 50% time reduction)
- ✅ Reduced smoke exposure for vulnerable groups
- ✅ Better emergency preparedness in communities
- ✅ Early warning system for wildfire spread

### Response Performance
- ⚡ Incidents reported within 2 minutes of observation
- ⚡ AI guidance delivered in < 5 seconds
- ⚡ Evacuation routes calculated instantly
- ⚡ Map updates every 60 seconds

### User Engagement
- 📊 Active incident reports from community
- 📊 AI chat conversations during emergencies
- 📊 Map interactions and data layer toggles
- 📊 Return users during subsequent events

---

## 🗺️ Roadmap

### ✅ Phase 1 - MVP (Current)
- [x] Basic wildfire incident reporting
- [x] Interactive emergency map
- [x] AeroGuard AI chat agent
- [x] Real-time air quality monitoring
- [x] NO2 prediction ML model
- [x] NASA TEMPO data integration

### 🚧 Phase 2 - Enhanced Platform (Next 3 Months)
- [ ] Mobile apps (iOS + Android)
- [ ] SMS/Push notification system
- [ ] Enhanced ML predictions (smoke plume forecasting)
- [ ] Multi-language support (Spanish, Chinese)
- [ ] Offline mode for connectivity loss
- [ ] Voice interaction with AI agent

### 🔮 Phase 3 - Emergency Services Integration (6 Months)
- [ ] EMS dashboard completion
- [ ] CAD (Computer-Aided Dispatch) integration
- [ ] Live traffic data for evacuation routes
- [ ] Hospital bed availability coordination
- [ ] 911 emergency system integration
- [ ] FEMA alert system connection

### 🌟 Phase 4 - Advanced Intelligence (Future)
- [ ] IoT air quality sensor network
- [ ] Drone footage integration
- [ ] AR evacuation guidance (smartphone AR)
- [ ] Predictive wildfire modeling (AI forecast)
- [ ] Satellite imagery analysis (detect fires early)
- [ ] Social media incident aggregation

---

## �🏗️ Project Structure

```
aeroguard/
├── backend/               # FastAPI backend server
│   ├── main.py           # API endpoints, ML models, and AeroGuard AI agent
│   ├── models/           # Trained ML models (.keras, .h5, .pkl)
│   └── requirements.txt  # Python dependencies
├── front-end/            # Next.js frontend application
│   ├── app/              # Next.js app directory
│   │   ├── api/         # API routes (AI agent, OpenAQ, reports)
│   │   ├── chat/        # AeroGuard AI emergency assistant
│   │   ├── map/         # Interactive wildfire & evacuation map
│   │   ├── report/      # Wildfire incident reporting
│   │   └── aqi-anderson/ # Air quality visualization
│   ├── components/       # React components
│   │   ├── map-viewer.tsx        # Emergency map component
│   │   ├── region-map.tsx        # Regional air quality maps
│   │   └── inline-report-form.tsx # Quick incident reporting
│   └── public/          # Static assets
├── data/                 # NASA TEMPO data processing
│   ├── tempo_data_utils.py  # TEMPO satellite data utilities
│   └── tempo_no2_data.csv   # Processed air quality data
├── ml/                   # Machine learning models
│   └── notebooks/       # Model training and experiments
└── .env                 # Environment variables (not in git)
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** (for backend and data processing)
- **Node.js 18+** and npm (for frontend)
- **NASA Earthdata Account** (for TEMPO satellite data)
- **Google Gemini API Key** (for AeroGuard AI emergency agent)

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

## 🚨 Core Features

### 1. Wildfire Incident Reporting
- **Real-time reporting** of wildfire events by citizens and observers
- **Location-based submissions** with GPS coordinates
- **Severity assessment** and incident categorization
- **Community alerts** for nearby residents

### 2. Interactive Emergency Map
- **Live wildfire tracking** with satellite data overlay
- **Smoke plume visualization** using TEMPO NO2/HCHO data
- **Evacuation routes** displayed on the map
- **Safe zones** and shelter locations
- **Real-time air quality heatmap** (NO2, HCHO, O3 levels)

### 3. AeroGuard AI Emergency Agent
The intelligent assistant provides:
- 🚨 **Immediate safety advice** based on your location and situation
- 🏃 **Evacuation guidance** - directions to nearest safe zones
- 😷 **Health precautions** for different risk groups (children, elderly, asthma)
- 🌬️ **Air quality alerts** - when to stay indoors, use masks, etc.
- ⏰ **Timeline predictions** - how long to shelter in place
- 📍 **Location-specific guidance** for Upstate South Carolina

Example interactions:
```
User: "I'm in Anderson, SC and I can see smoke"
AeroGuard: "🚨 SMOKE ALERT: Anderson, SC
- IMMEDIATE: Close all windows and doors
- Turn on AC to recirculate indoor air
- Avoid outdoor activities for next 4-6 hours
- Safe zones: Clemson area (15 miles west) has clearer air
- Timeline: Smoke expected to clear by 6 PM based on wind patterns"
```

### 4. Evacuation Guidance System
- **Nearest evacuation routes** calculated from your location
- **Real-time traffic updates** for evacuation routes
- **Shelter availability** and capacity information
- **Pet-friendly shelters** identification
- **Accessible routes** for people with disabilities

### 5. EMS Dashboard (Future Development)
- **Emergency responder view** with priority incidents
- **Resource allocation** recommendations
- **Air quality safety zones** for first responders
- **Incident command integration**

## 🤖 AeroGuard AI Capabilities

### Wildfire Response Advice
```python
# AeroGuard provides location-specific emergency guidance
POST /chat
{
  "location": "Anderson, SC",
  "situation": "Wildfire nearby, heavy smoke"
}
```

### Pollution Event Guidance
```python
# Get advice for high pollution days
POST /chat
{
  "location": "Greenville, SC", 
  "context": "AQI over 150, asthma patient"
}
```

## 🤖 API Endpoints

### Backend API (Port 8000)

- **GET** `/` - Health check
- **POST** `/predict-no2` - Predict NO2 levels for air quality forecasting
  ```json
  {
    "values": [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1]
  }
  ```
- **POST** `/chat` - AeroGuard AI emergency agent (wildfire & air quality guidance)
- **POST** `/report` - Submit wildfire incident report
- **GET** `/incidents` - Get active wildfire incidents
- **GET** `/evacuation-routes` - Get nearest evacuation routes

### Frontend Routes (Port 3000)

- `/` - Home dashboard with current alerts
- `/map` - Interactive emergency map (wildfires, air quality, evacuations)
- `/chat` - AeroGuard AI assistant chat interface
- `/report` - Report wildfire or air quality incident
- `/aqi-anderson` - Air quality visualization for Anderson, SC
- `/api/ai` - AI assistant backend integration
- `/api/openaq` - OpenAQ air quality data API
- `/api/report` - Incident reporting API

## 🧪 Machine Learning Models

### NO2 Prediction Model
- **Purpose:** Forecast air quality changes during wildfire events
- **Type:** LSTM/Time Series Neural Network
- **Input:** 10 previous NO2 measurements from TEMPO satellite
- **Output:** Next NO2 value prediction (helps predict smoke movement)
- **Use Case:** Predict when air quality will improve/worsen
- **Location:** `backend/models/no2_pred_10_window_newer.keras`

### AQI Forecasting Model
- **Purpose:** Multi-pollutant air quality forecasting
- **Type:** Multi-feature ML model
- **Use Case:** Generate evacuation timeline predictions
- **Location:** `backend/models/aqi_forecaster_model.h5`

### Model Applications in Emergency Response
- **Smoke plume prediction** - Where smoke will move in next 4-6 hours
- **Evacuation timing** - When it's safe to return home
- **Safe zone identification** - Areas with acceptable air quality
- **Health risk assessment** - Personalized risk levels for different groups

## 🛠️ Technologies Used

### Backend
- **FastAPI** - Modern Python web framework for API endpoints
- **TensorFlow/Keras** - ML models for air quality prediction
- **Google Generative AI (Gemini)** - AeroGuard emergency AI agent
- **Pandas & NumPy** - Data processing and analysis
- **xarray & netCDF4** - NASA TEMPO satellite data processing
- **earthaccess** - NASA Earthdata authentication and access

### Frontend
- **Next.js 15** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript for robust development
- **Tailwind CSS** - Utility-first styling for responsive emergency UI
- **D3.js** - Advanced data visualization for maps and air quality charts
- **Radix UI** - Accessible component primitives for inclusive design
- **Leaflet/Mapbox** (future) - Interactive emergency mapping

### Data Sources
- **NASA TEMPO** - Tropospheric pollution monitoring (NO2, HCHO, O3)
- **OpenAQ** - Global air quality data
- **EONET** - Earth Observatory Natural Event Tracker (wildfires)

## 🎯 Use Cases

### For Citizens
1. **Report a wildfire** you observe in your area
2. **Get evacuation guidance** when smoke approaches
3. **Chat with AeroGuard AI** for personalized safety advice
4. **View air quality map** to decide if it's safe to go outside
5. **Find safe zones** and shelter locations

### For Emergency Managers
1. **Monitor active incidents** on centralized dashboard
2. **Access real-time air quality data** for decision-making
3. **Coordinate evacuations** using predicted smoke movement
4. **Identify vulnerable populations** in affected areas
5. **Plan resource deployment** based on incident severity

### For First Responders (EMS View - Future)
1. **Assess air quality** before entering affected areas
2. **Locate incident hotspots** on emergency map
3. **Access health risk data** for crew safety
4. **Coordinate with dispatch** using shared incident data

## 📝 Development

### Running Jupyter Notebooks

```bash
cd ml/notebooks
jupyter notebook
```

Available notebooks:
- `data.ipynb` - NASA TEMPO data exploration
- `new_stuff.ipynb` - Latest model experiments
- `stuff.ipynb` - Air quality prediction model development

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

This is a NASA Space Apps Challenge project built to save lives during wildfire and air quality emergencies. For contributions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/emergency-alerts`)
3. Commit your changes (`git commit -m 'Add emergency SMS alerts'`)
4. Push to the branch (`git push origin feature/emergency-alerts`)
5. Create a Pull Request

### Priority Development Areas
- 🚁 Integration with emergency dispatch systems
- 📱 Mobile app development (iOS/Android)
- 🗺️ Enhanced mapping with live traffic data
- 🏥 EMS dashboard completion
- 🌐 Multi-language support for diverse communities
- ♿ Accessibility improvements for people with disabilities

## 📧 Contact

**Project:** AeroGuard - Wildfire Response Platform  
**Repository:** [github.com/nimnay/space-apps-earth-data](https://github.com/nimnay/space-apps-earth-data)  
**Challenge:** NASA Space Apps Challenge 2025

## 🙏 Acknowledgments

- **NASA** - For TEMPO satellite data and Earth Observatory Natural Event Tracker (EONET)
- **NASA Space Apps Challenge 2025** - For inspiring innovation in emergency response
- **Clemson University** - For hosting the Space Apps Challenge
- **OpenAQ** - For global air quality data API
- **Google Gemini AI** - For powering the AeroGuard emergency agent
- **First Responders** - For their tireless work protecting communities from wildfires

---

**Built with ❤️ to save lives during environmental emergencies**

*AeroGuard: Your AI companion when every second counts*
