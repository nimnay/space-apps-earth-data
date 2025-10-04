import netCDF4 as nc
import pandas as pd
import numpy as np
import os

# === CONFIG ===
input_file = "TEMPO_NO2_L2_V03_20240717T232209Z_S015G06.nc"   # <-- change this to your .nc file name
output_csv = "tempo_no2_data.csv"

# === OPEN FILE ===
ds = nc.Dataset(input_file, mode='r')

# Extract variables from groups
lat = ds.groups['geolocation'].variables['latitude'][:]
lon = ds.groups['geolocation'].variables['longitude'][:]
no2_tropo = ds.groups['product'].variables['vertical_column_troposphere'][:]

# Optional: extract timestamp if needed
time = ds.groups['geolocation'].variables['time'][:]

# Flatten everything
lat_flat = lat.flatten()
lon_flat = lon.flatten()
no2_flat = no2_tropo.flatten()

# Build DataFrame
df = pd.DataFrame({
    'latitude': lat_flat,
    'longitude': lon_flat,
    'NO2_troposphere': no2_flat
})

# Clean data (remove NaN/Inf)
df = df.replace([np.inf, -np.inf], np.nan).dropna()

# Save
df.to_csv(output_csv, index=False)
print(f"✅ CSV saved as: {os.path.abspath(output_csv)}")

# Close dataset
ds.close()