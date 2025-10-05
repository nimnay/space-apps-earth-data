from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path
import numpy as np
import tensorflow as tf

app = FastAPI()


model = tf.keras.models.load_model("no2_pred_10_window_newer.keras")


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
