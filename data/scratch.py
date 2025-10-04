import netCDF4 as nc

file = "TEMPO_NO2_L2_V03_20240717T232209Z_S015G06.nc"  # change to your filename
ds = nc.Dataset(file, 'r')

print("\n📁 Root variables:")
for var in ds.variables.keys():
    print("  -", var)

print("\n📂 Groups:")
for group_name in ds.groups.keys():
    print("  -", group_name)
    group = ds.groups[group_name]
    print("    Variables:")
    for v in group.variables.keys():
        print("      -", v)