"""
TEMPO Earth Data Extraction Utilities

This module provides functions to extract and process TEMPO satellite data
for air quality monitoring (NO2, HCHO, O3, etc.).
"""

import earthaccess
import xarray as xr
import netCDF4 as nc
import pandas as pd
import numpy as np
import os
from typing import Optional, List
from pathlib import Path


def authenticate_earthaccess():
    """Authenticate with NASA Earthaccess."""
    earthaccess.login()


def search_tempo_data(
    short_name: str,
    cloud_hosted: bool = True,
    count: int = 5
) -> List:
    """
    Search for TEMPO datasets.
    
    Args:
        short_name: Dataset short name (e.g., 'TEMPO_NO2_L3', 'TEMPO_HCHO_L3')
        cloud_hosted: Whether to search for cloud-hosted data
        count: Number of results to return
    
    Returns:
        List of search results
    """
    results = earthaccess.search_data(
        short_name=short_name,
        cloud_hosted=cloud_hosted,
        count=count
    )
    return results


def load_tempo_dataset(results: List, index: int = 0) -> xr.Dataset:
    """
    Load a TEMPO dataset from search results using xarray.
    
    Args:
        results: Search results from earthaccess
        index: Index of the result to load
    
    Returns:
        xarray Dataset with TEMPO data
    """
    files = earthaccess.open(results)
    ds = xr.open_dataset(files[index])
    return ds


def extract_netcdf_to_csv(
    input_file: str,
    output_csv: Optional[str] = None,
    variable_name: str = 'vertical_column_troposphere',
    product_group: str = 'product',
    geolocation_group: str = 'geolocation'
) -> pd.DataFrame:
    """
    Extract data from a NetCDF file and save to CSV.
    
    Args:
        input_file: Path to input .nc file
        output_csv: Path to output CSV file (optional)
        variable_name: Name of the variable to extract
        product_group: Name of the product group in NetCDF
        geolocation_group: Name of the geolocation group in NetCDF
    
    Returns:
        DataFrame with extracted data
    """
    # Open NetCDF file
    ds = nc.Dataset(input_file, mode='r')
    
    try:
        # Extract variables from groups
        lat = ds.groups[geolocation_group].variables['latitude'][:]
        lon = ds.groups[geolocation_group].variables['longitude'][:]
        data_var = ds.groups[product_group].variables[variable_name][:]
        
        # Flatten everything
        lat_flat = lat.flatten()
        lon_flat = lon.flatten()
        data_flat = data_var.flatten()
        
        # Build DataFrame
        df = pd.DataFrame({
            'latitude': lat_flat,
            'longitude': lon_flat,
            variable_name: data_flat
        })
        
        # Clean data (remove NaN/Inf)
        df = df.replace([np.inf, -np.inf], np.nan).dropna()
        
        # Save to CSV if output path is provided
        if output_csv:
            df.to_csv(output_csv, index=False)
            print(f"✅ CSV saved as: {os.path.abspath(output_csv)}")
        
        return df
        
    finally:
        # Always close the dataset
        ds.close()


def inspect_netcdf_structure(file_path: str):
    """
    Print the structure of a NetCDF file.
    
    Args:
        file_path: Path to the .nc file
    """
    ds = nc.Dataset(file_path, 'r')
    
    try:
        print("\n📁 Root variables:")
        for var in ds.variables.keys():
            print(f"  - {var}")
        
        print("\n📂 Groups:")
        for group_name in ds.groups.keys():
            print(f"  - {group_name}")
            group = ds.groups[group_name]
            print("    Variables:")
            for v in group.variables.keys():
                print(f"      - {v}")
    finally:
        ds.close()


def get_all_tempo_datasets():
    """
    Search for all major TEMPO datasets.
    
    Returns:
        Dictionary with dataset names as keys and search results as values
    """
    datasets = {
        'NO2': 'TEMPO_NO2_L3',
        'HCHO': 'TEMPO_HCHO_L3',
        'O3': 'TEMPO_O3TOT_L3',
        'Radiance': 'TEMPO_RAD_L1'
    }
    
    results = {}
    for name, short_name in datasets.items():
        print(f"Searching for {name}...")
        results[name] = search_tempo_data(short_name)
    
    return results


# Example usage
if __name__ == "__main__":
    # Authenticate
    authenticate_earthaccess()
    
    # Search for NO2 data
    no2_results = search_tempo_data('TEMPO_NO2_L3', count=5)
    
    # Load dataset
    ds_no2 = load_tempo_dataset(no2_results, index=0)
    print("NO2 dataset variables:", list(ds_no2.data_vars))
    print("Dataset shape:", ds_no2.dims)
    
    # Access specific variables
    if 'tropospheric_no2_column' in ds_no2.data_vars:
        no2_column = ds_no2['tropospheric_no2_column']
        print("NO2 column shape:", no2_column.shape)
