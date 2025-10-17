# Data Processing Utilities

This directory contains utilities for processing NASA TEMPO satellite data.

## Files

### `tempo_data_utils.py`
Consolidated utilities for extracting and processing TEMPO satellite data. This combines functionality from multiple legacy scripts into a single, well-documented module.

**Key Functions:**
- `authenticate_earthaccess()` - Authenticate with NASA Earthdata
- `search_tempo_data()` - Search for TEMPO datasets
- `load_tempo_dataset()` - Load datasets using xarray
- `extract_netcdf_to_csv()` - Convert NetCDF files to CSV
- `inspect_netcdf_structure()` - Examine NetCDF file structure
- `get_all_tempo_datasets()` - Search all TEMPO dataset types

### `tempo_no2_data.csv`
Processed NO2 data from TEMPO satellite (if present, excluded from git).

## Usage Examples

### Basic Data Extraction

```python
from tempo_data_utils import (
    authenticate_earthaccess,
    search_tempo_data,
    load_tempo_dataset
)

# Authenticate
authenticate_earthaccess()

# Search for NO2 data
results = search_tempo_data('TEMPO_NO2_L3', count=5)

# Load dataset
ds = load_tempo_dataset(results, index=0)
print(ds.data_vars)
```

### Convert NetCDF to CSV

```python
from tempo_data_utils import extract_netcdf_to_csv

df = extract_netcdf_to_csv(
    input_file='TEMPO_NO2_L2_V03_20240717T232209Z_S015G06.nc',
    output_csv='tempo_no2_data.csv',
    variable_name='vertical_column_troposphere'
)
```

### Inspect NetCDF Structure

```python
from tempo_data_utils import inspect_netcdf_structure

inspect_netcdf_structure('your_file.nc')
```

## TEMPO Datasets

Available TEMPO dataset types:
- `TEMPO_NO2_L3` - Nitrogen Dioxide (NO2)
- `TEMPO_HCHO_L3` - Formaldehyde (HCHO)
- `TEMPO_O3TOT_L3` - Total Ozone (O3)
- `TEMPO_RAD_L1` - Radiance data

## Requirements

```bash
pip install earthaccess xarray netCDF4 pandas numpy
```

## NASA Earthdata Authentication

1. Register at: https://urs.earthdata.nasa.gov/users/new
2. Create `.netrc` file in your home directory:
   ```
   machine urs.earthdata.nasa.gov
   login YOUR_USERNAME
   password YOUR_PASSWORD
   ```

The `earthaccess` library will automatically use these credentials.
