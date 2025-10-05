from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path
import numpy as np
import tensorflow as tf
import google.generativeai as genai

app = FastAPI()


model = tf.keras.models.load_model("no2_pred_10_window_newer.keras")


class NO2Input(BaseModel):
    values: list[float] = Field(..., min_length=10, max_length=10)


@app.get("/")
def root():
    return {"message": "NO2 prediction service"}


@app.post("/predict-no2")
def predict_no2(payload: NO2Input):
    print(payload)
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
