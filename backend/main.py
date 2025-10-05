from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path
import numpy as np
import tensorflow as tf
import google.generativeai as genai

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

MODEL_PATH = Path(__file__).resolve().parent / "no2_pred_10_window_newer.keras"
if not MODEL_PATH.exists():
    raise RuntimeError(f"Model file not found: {MODEL_PATH}")
model = tf.keras.models.load_model(str(MODEL_PATH))


class NO2Input(BaseModel):
    values: list[float] = Field(..., min_length=10, max_length=10)


@app.get("/")
def root():
    return {"message": "NO2 prediction service"}


@app.post("/predict-no2")
def predict_no2(payload: NO2Input):
    arr = np.array(payload.values, dtype=float)
    input_data = arr.reshape(1, 10, 1)
    pred = model.predict(input_data, verbose=0)
    prediction = float(np.asarray(pred).squeeze())
    return {"prediction": prediction}


GEMINI_API_KEY = "AIzaSyCpYug6XhxMOsBePcaZGjRADIvwKP31ERU"


class AeroGuardAI:
    def __init__(self):
        if not GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY environment variable not set")
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def _clean_response(self, text: str) -> str:
        lines = text.strip().split("\n")
        cleaned: list[str] = []
        for line in lines:
            t = line.strip()
            if t.startswith("•"):
                t = "- " + t[1:].strip()
            elif t.startswith("*"):
                t = "- " + t[1:].strip()
            elif t.startswith("1."):
                t = "- " + t[2:].strip()
            if t:
                cleaned.append(t)
        return "\n".join(cleaned)

    def get_wildfire_advice(self, location: str, user_context: str = "") -> str:
        prompt = f"""
You are AeroGuard - emergency air quality assistant for Upstate SC.

USER SITUATION: {location}. {user_context}

RESPONSE FORMAT:
🚨 SMOKE ALERT: [Location]

IMMEDIATE ACTIONS:
• [Action 1 with reason]
• [Action 2 with reason]

HEALTH PRECAUTIONS:
• [Group-specific advice]

SAFETY ZONES:
✅ Safe: [Areas]
🚫 Avoid: [Areas]

⏰ TIMELINE: [What to expect]

Keep under 200 words. Be specific about Upstate SC locations.
"""
        try:
            resp = self.model.generate_content(prompt)
        except Exception as e:
            print(e)
        return self._clean_response(resp.text)

    def get_pollution_advice(
        self, location: str, activity: str, user_context: str = ""
    ) -> str:
        prompt = f"""
You are AeroGuard - daily air quality advisor for Upstate SC.

USER SITUATION: {location}. Planning: {activity}. {user_context}

RESPONSE FORMAT:
🌫️ AIR QUALITY ADVISORY: [Location]

ACTIVITY GUIDANCE:
• [Timing recommendations]
• [Alternative options]

HEALTHY ROUTES:
✅ Clean air: [Routes]
🚫 High pollution: [Areas]

HEALTH TIPS:
• [Specific advice]

Keep under 200 words. Suggest real Upstate SC locations.
"""
        try:
            resp = self.model.generate_content(prompt)
        except Exception as e:
            print(e)
        return self._clean_response(resp.text)


ai_helper = AeroGuardAI()


# Example request bodies:
# POST /wildfire-advice
# {
#   "location": "Greenville, SC near Paris Mountain",
#   "user_context": "Asthmatic senior, light outdoor chores planned"
# }
#
# POST /pollution-advice
# {
#   "location": "Spartanburg, SC",
#   "activity": "Evening 5K run on Rail Trail",
#   "user_context": "Mild seasonal allergies"
# }


class WildfireAdviceRequest(BaseModel):
    location: str | None = ""
    user_context: str | None = ""


class PollutionAdviceRequest(BaseModel):
    location: str | None = ""
    activity: str | None = ""
    user_context: str | None = ""


@app.post("/wildfire-advice")
def wildfire_advice(payload: WildfireAdviceRequest):
    try:
        return {
            "advice": ai_helper.get_wildfire_advice(
                payload.location, payload.user_context or ""
            )
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/pollution-advice")
def pollution_advice(payload: PollutionAdviceRequest):

    try:
        return {
            "advice": ai_helper.get_pollution_advice(
                payload.location, payload.activity, payload.user_context or ""
            )
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import warnings
from pydantic import BaseModel, Field

warnings.filterwarnings("ignore")

# NASA Power API Configuration
NASA_POWER_BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

# Weather parameters from NASA Power API
WEATHER_PARAMS = [
    "T2M",  # Temperature at 2 meters (°C)
    "T2M_MAX",  # Max Temperature (°C)
    "T2M_MIN",  # Min Temperature (°C)
    "RH2M",  # Relative Humidity (%)
    "PRECTOTCORR",  # Precipitation (mm/day)
    "WS10M",  # Wind Speed at 10m (m/s)
    "PS",  # Surface Pressure (kPa)
]

# South Carolina cities with coordinates
SC_CITIES = {
    "Charleston": {"lat": 32.7765, "lon": -79.9311},
    "Columbia": {"lat": 34.0007, "lon": -81.0348},
    "Greenville": {"lat": 34.8526, "lon": -82.3940},
    "Myrtle Beach": {"lat": 33.6891, "lon": -78.8867},
    "Spartanburg": {"lat": 34.9496, "lon": -81.9320},
    "Florence": {"lat": 34.1954, "lon": -79.7626},
    "Rock Hill": {"lat": 34.9249, "lon": -81.0251},
    "Sumter": {"lat": 33.9204, "lon": -80.3414},
    "Anderson": {"lat": 34.5034, "lon": -82.6501},
    "Clemson": {"lat": 34.6834, "lon": -82.8374},
}


def calculate_aqi_from_weather(weather_row):
    """
    Simple AQI estimation from weather parameters
    Based on empirical relationships between weather and air quality
    """
    temp = weather_row.get("T2M", 20)
    humidity = weather_row.get("RH2M", 50)
    wind_speed = weather_row.get("WS10M", 5)
    precipitation = weather_row.get("PRECTOTCORR", 0)
    pressure = weather_row.get("PS", 101.3)

    # Check for invalid/missing data (NASA POWER API uses -999 for missing data)
    if (
        temp < -900
        or humidity < -900
        or wind_speed < -900
        or precipitation < -900
        or pressure < -900
    ):
        # Return a reasonable default for missing data rather than an extreme value
        return 50  # Moderate AQI is a reasonable default

    # Base AQI calculation
    base_aqi = 50  # Moderate baseline

    # Weather effects on AQI
    temp_effect = (temp - 20) * 0.8  # Higher temp = higher AQI
    wind_effect = -(wind_speed - 5) * 2.5  # Higher wind = lower AQI
    humidity_effect = abs(humidity - 55) * 0.3  # Extreme humidity = higher AQI
    precip_effect = -precipitation * 3  # Rain = lower AQI
    pressure_effect = (pressure - 101.3) * 0.5  # High pressure = higher AQI

    # Calculate final AQI
    aqi = (
        base_aqi
        + temp_effect
        + wind_effect
        + humidity_effect
        + precip_effect
        + pressure_effect
    )

    # Add realistic variation
    aqi += np.random.normal(0, 8)

    # Keep within realistic bounds
    return max(10, min(150, aqi))


def predict_aqi_from_date(city_name, target_date, days_back=10):
    """
    STANDALONE FUNCTION: Fetch weather data for previous N days from a specific date and predict next day's AQI

    This function is completely self-contained and doesn't depend on any external variables.

    Parameters:
    - city_name: Name of South Carolina city (must be in SC_CITIES)
    - target_date: Date to predict from (string 'YYYY-MM-DD' or datetime object)
    - days_back: Number of previous days to fetch (default 10)

    Returns:
    - Dictionary with prediction results and historical data DataFrame
    """
    print(f"\n🎯 PREDICTING AQI FROM SPECIFIC DATE")
    print("=" * 50)

    # Validate city
    if city_name not in SC_CITIES:
        available_cities = ", ".join(SC_CITIES.keys())
        return {
            "error": f"City '{city_name}' not found. Available cities: {available_cities}"
        }

    # Parse target date
    if isinstance(target_date, str):
        try:
            target_date = datetime.strptime(target_date, "%Y-%m-%d").date()
        except ValueError:
            return {"error": "Date must be in format 'YYYY-MM-DD'"}
    elif hasattr(target_date, "date"):
        target_date = target_date.date()

    # Calculate date range (previous N days from target date)
    end_date = target_date
    start_date = end_date - timedelta(days=days_back)
    prediction_date = end_date + timedelta(days=1)

    print(f"📅 Target Date: {target_date}")
    print(f"📊 Fetching data from {start_date} to {end_date}")
    print(f"🔮 Predicting AQI for: {prediction_date}")

    # Get city coordinates
    coords = SC_CITIES[city_name]

    # Prepare NASA Power API request
    url = NASA_POWER_BASE_URL
    params = {
        "parameters": ",".join(WEATHER_PARAMS),
        "community": "RE",
        "longitude": coords["lon"],
        "latitude": coords["lat"],
        "start": start_date.strftime("%Y%m%d"),
        "end": end_date.strftime("%Y%m%d"),
        "format": "JSON",
    }

    try:
        print(f"📡 Fetching historical weather data for {city_name}...")
        response = requests.get(url, params=params, timeout=30)

        if response.status_code != 200:
            return {"error": f"NASA Power API error: HTTP {response.status_code}"}

        data = response.json()
        weather_data = data["properties"]["parameter"]

        # Build historical dataframe
        records = []
        available_dates = list(weather_data["T2M"].keys())

        for date_str in available_dates:
            date_obj = datetime.strptime(date_str, "%Y%m%d").date()

            # Collect weather parameters for this date
            weather_row = {"date": date_obj}
            for param in WEATHER_PARAMS:
                if param in weather_data and date_str in weather_data[param]:
                    weather_row[param] = weather_data[param][date_str]

            # Calculate AQI from weather parameters
            aqi = calculate_aqi_from_weather(weather_row)
            weather_row["aqi"] = aqi

            records.append(weather_row)

        # Create DataFrame
        df = pd.DataFrame(records)
        df = df.sort_values("date").reset_index(drop=True)

        print(f"✅ Retrieved {len(df)} days of historical data")

        if len(df) < 2:
            return {"error": "Insufficient historical data for prediction"}

        # Filter out days with invalid weather data
        valid_df = df[df["T2M"] > -900].copy()
        print(
            f"🧹 Filtered out {len(df) - len(valid_df)} days with invalid weather data"
        )

        if len(valid_df) < 3:
            print("⚠️ Warning: Limited valid historical data available")
            # If we don't have enough valid data, use the original df but with reasonable defaults
            for col in WEATHER_PARAMS:
                df.loc[df[col] < -900, col] = (
                    df.loc[df[col] > -900, col].mean()
                    if sum(df[col] > -900) > 0
                    else {
                        "T2M": 20,
                        "T2M_MAX": 25,
                        "T2M_MIN": 15,
                        "RH2M": 50,
                        "PRECTOTCORR": 0,
                        "WS10M": 5,
                        "PS": 101.3,
                    }.get(col, 0)
                )
            valid_df = df

        # Train simple prediction model
        print("🤖 Training prediction model...")

        # Prepare features and targets
        features = []
        targets = []

        # Use sliding window for training (increased from 3 to 5 for more stability)
        window_size = min(5, len(valid_df) - 1)

        for i in range(window_size, len(valid_df)):
            # Features: recent AQI + weather averages
            feature_row = []

            # Recent AQI values
            for j in range(window_size):
                feature_row.append(valid_df.iloc[i - window_size + j]["aqi"])

            # Recent weather averages
            recent_weather = valid_df.iloc[i - window_size : i]
            for param in WEATHER_PARAMS:
                if param in valid_df.columns:
                    feature_row.append(recent_weather[param].mean())

            # Temporal features
            current_date = df.iloc[i]["date"]
            feature_row.append(current_date.timetuple().tm_yday)  # Day of year
            feature_row.append(current_date.weekday())  # Day of week

            features.append(feature_row)
            targets.append(valid_df.iloc[i]["aqi"])

        # Train model if we have enough data
        if len(features) >= 3:  # Require at least 3 samples for better stability
            X = np.array(features)
            y = np.array(targets)

            # Use RandomForest for prediction
            model = RandomForestRegressor(n_estimators=50, random_state=42)
            scaler = StandardScaler()

            X_scaled = scaler.fit_transform(X)
            model.fit(X_scaled, y)

            # Prepare features for prediction
            prediction_features = []

            # Use last window_size days for prediction (from valid data)
            valid_recent = valid_df.tail(window_size)
            recent_aqi = valid_recent["aqi"].values

            # If we don't have enough recent valid data, use all available
            if len(recent_aqi) < window_size:
                padding_needed = window_size - len(recent_aqi)
                recent_aqi = np.pad(recent_aqi, (padding_needed, 0), "edge")

            for aqi_val in recent_aqi:
                prediction_features.append(aqi_val)

            # Recent weather averages (using valid data)
            for param in WEATHER_PARAMS:
                if param in valid_df.columns:
                    # Calculate mean of valid values only
                    param_values = valid_recent[param].values
                    valid_values = param_values[param_values > -900]
                    if len(valid_values) > 0:
                        prediction_features.append(valid_values.mean())
                    else:
                        # Use a reasonable default if no valid values
                        defaults = {
                            "T2M": 20,
                            "T2M_MAX": 25,
                            "T2M_MIN": 15,
                            "RH2M": 50,
                            "PRECTOTCORR": 0,
                            "WS10M": 5,
                            "PS": 101.3,
                        }
                        prediction_features.append(defaults.get(param, 0))
                else:
                    prediction_features.append(0)

            # Temporal features for prediction date
            prediction_features.append(prediction_date.timetuple().tm_yday)
            prediction_features.append(prediction_date.weekday())

            # Make prediction
            X_pred = np.array([prediction_features])
            X_pred_scaled = scaler.transform(X_pred)
            predicted_aqi = model.predict(X_pred_scaled)[0]
            method = "Random Forest"

        else:
            # Fallback: simple trend-based prediction
            recent_aqi = df["aqi"].tail(3).values
            trend = (
                (recent_aqi[-1] - recent_aqi[0]) / len(recent_aqi)
                if len(recent_aqi) > 1
                else 0
            )
            predicted_aqi = recent_aqi[-1] + trend
            method = "Simple Trend"

        # Calculate historical AQI statistics for more reasonable bounds
        valid_aqi = valid_df["aqi"].values
        aqi_mean = valid_aqi.mean()
        aqi_std = valid_aqi.std() if len(valid_aqi) > 1 else 20

        # Apply a more dynamic bound based on historical data
        # Allow prediction to be at most 2 standard deviations from mean
        lower_bound = max(10, aqi_mean - 2 * aqi_std)
        upper_bound = min(150, aqi_mean + 2 * aqi_std)

        # Bound prediction with these more data-driven limits
        predicted_aqi = max(lower_bound, min(upper_bound, predicted_aqi))

        print(f"📊 AQI Statistics - Mean: {aqi_mean:.1f}, StdDev: {aqi_std:.1f}")
        print(f"🔍 Prediction bounded between {lower_bound:.1f} and {upper_bound:.1f}")

        # Determine AQI level
        if predicted_aqi <= 50:
            aqi_level = "Good 🟢"
            description = "Air quality is satisfactory"
        elif predicted_aqi <= 100:
            aqi_level = "Moderate 🟡"
            description = "Acceptable for most people"
        elif predicted_aqi <= 150:
            aqi_level = "Unhealthy for Sensitive Groups 🟠"
            description = "Sensitive individuals may experience problems"
        else:
            aqi_level = "Unhealthy 🔴"
            description = "Everyone may experience health effects"

        # Prepare results
        results = {
            "city": city_name,
            "target_date": target_date.strftime("%Y-%m-%d"),
            "prediction_date": prediction_date.strftime("%Y-%m-%d"),
            "predicted_aqi": round(predicted_aqi, 1),
            "aqi_level": aqi_level,
            "description": description,
            "method": method,
            "historical_data": df,
            "data_points": len(df),
            "date_range": f"{df['date'].min()} to {df['date'].max()}",
            "recent_aqi": [round(x, 1) for x in df["aqi"].tail(5).values],
        }

        # Print results
        print(f"\n📊 Historical Data Summary:")
        print(f"   📅 Date Range: {results['date_range']}")
        print(f"   📈 AQI Trend: {' → '.join(map(str, results['recent_aqi']))}")
        print(f"   📊 Average AQI: {df['aqi'].mean():.1f}")
        print(f"   🧐 Valid data points: {len(valid_df)} / {len(df)}")

        # Add recent valid AQI values for diagnosis
        valid_recent_aqi = valid_df.tail(5)["aqi"].tolist()
        results["valid_recent_aqi"] = [round(x, 1) for x in valid_recent_aqi]
        print(
            f"   📉 Recent Valid AQI: {' → '.join(map(str, results['valid_recent_aqi']))}"
        )

        print(f"\n🔮 AQI Prediction for {prediction_date}:")
        print(f"   🎯 Predicted AQI: {results['predicted_aqi']}")
        print(f"   🌬️ Air Quality Level: {aqi_level}")
        print(f"   📝 {description}")
        print(f"   🤖 Prediction Method: {method}")

        return results

    except Exception as e:
        return {"error": f"Error processing data: {str(e)}"}


# === USAGE EXAMPLES ===
def run_standalone_examples():
    """Demonstrate the standalone AQI prediction function"""

    print("🚀 STANDALONE AQI PREDICTION EXAMPLES")
    print("=" * 60)

    # Example 1: Predict from a specific historical date
    print("\n🔍 EXAMPLE 1: Historical prediction from September 1, 2024")
    result1 = predict_aqi_from_date("Charleston", "2024-09-01", days_back=10)

    if "error" not in result1:
        print("✅ Historical prediction successful!")
        print(f"   Data shape: {result1['historical_data'].shape}")
        print(f"   Predicted AQI: {result1['predicted_aqi']} ({result1['aqi_level']})")
    else:
        print(f"❌ Error: {result1['error']}")

    print("\n" + "-" * 60)

    # Example 2: Predict from recent date
    recent_date = (datetime.now() - timedelta(days=5)).date()
    print(f"\n🔍 EXAMPLE 2: Recent prediction from {recent_date}")
    result2 = predict_aqi_from_date("Columbia", recent_date, days_back=8)

    if "error" not in result2:
        print("✅ Recent prediction successful!")
        print(f"   Predicted AQI: {result2['predicted_aqi']} ({result2['aqi_level']})")
        # Show sample of historical data
        df = result2["historical_data"]
        print(f"   Sample data:")
        print(f"   {df[['date', 'aqi', 'T2M', 'RH2M']].tail(3).to_string(index=False)}")
    else:
        print(f"❌ Error: {result2['error']}")

    return result1, result2


class CityAQIRequest(BaseModel):
    city: str = Field(..., description="City name (e.g., Greenville)")
    days_back: int = Field(10, ge=2, le=30, description="Number of prior days to use")


@app.post("/city-aqi")
def get_city_aqi(payload: CityAQIRequest):
    target_date = datetime.utcnow().date() + timedelta(days=1)
    result = predict_aqi_from_date(payload.city, target_date, days_back=100)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    df = result.pop("historical_data", None)
    if df is not None:
        hist_records = []
        tail_n = min(len(df), payload.days_back + 1)
        for r in df.tail(tail_n).itertuples():
            rec = {"date": r.date.strftime("%Y-%m-%d"), "aqi": round(r.aqi, 1)}
            for p in WEATHER_PARAMS:
                if p in df.columns:
                    rec[p] = getattr(r, p)
            hist_records.append(rec)
        result["historical_data"] = hist_records

    return result
