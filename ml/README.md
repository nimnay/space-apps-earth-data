# Machine Learning Models and Notebooks

This directory contains Jupyter notebooks for machine learning experiments and model development.

## Notebooks

### `notebooks/`
Contains Jupyter notebooks for:
- Data exploration and analysis
- Model training and experimentation
- Feature engineering
- Performance evaluation

**Recommended Notebooks:**
- `data.ipynb` - Initial data exploration
- `new_stuff.ipynb` - Latest experiments
- `stuff.ipynb` - Model development

## Running Notebooks

```bash
# Install Jupyter
pip install jupyter

# Start Jupyter
cd ml/notebooks
jupyter notebook
```

Or use VS Code with the Jupyter extension for an integrated experience.

## Models

Trained models are stored in `backend/models/` for production use:
- `no2_pred_10_window_newer.keras` - NO2 prediction model (LSTM)
- `aqi_forecaster_model.h5` - AQI forecasting model
- `*.pkl` - Scikit-learn models

## Development Workflow

1. **Experiment** in Jupyter notebooks
2. **Train** models with cross-validation
3. **Export** trained models to `backend/models/`
4. **Integrate** models into FastAPI backend
5. **Test** via API endpoints

## Common Libraries

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
```

## Best Practices

- Document your experiments with markdown cells
- Save model checkpoints during training
- Track metrics and visualizations
- Version control your notebooks (use `git` with `.ipynb` files)
- Clear output before committing to reduce file size

## Model Requirements

```bash
pip install tensorflow keras scikit-learn pandas numpy matplotlib seaborn
```

See `backend/requirements.txt` for complete dependencies.
