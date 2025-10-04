import earthaccess
import xarray as xr

# Authenticate
earthaccess.login()

# Search for datasets
no2_results = earthaccess.search_data(
    short_name='TEMPO_NO2_L3',
    cloud_hosted=True,
    count=5
)

hcho_results = earthaccess.search_data(
    short_name='TEMPO_HCHO_L3', 
    cloud_hosted=True,
    count=5
)

ozone_results = earthaccess.search_data(
    short_name='TEMPO_O3TOT_L3',  # Total ozone
    cloud_hosted=True,
    count=5
)

radiance_results = earthaccess.search_data(
    short_name='TEMPO_RAD_L1',
    cloud_hosted=True,
    count=5
)

# Open datasets directly from cloud (no download!)
# This creates a file-like object that streams data
files = earthaccess.open(no2_results)

# Load with xarray - data is streamed as needed
ds_no2 = xr.open_dataset(files[0])
print("NO2 dataset variables:", list(ds_no2.data_vars))
print("Dataset shape:", ds_no2.dims)

# Access specific variables without loading full dataset
no2_column = ds_no2['tropospheric_no2_column']
print("NO2 column shape:", no2_column.shape)