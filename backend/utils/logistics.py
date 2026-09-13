import math

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance in kilometers between two points."""
    R = 6371.0  Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.asin(math.sqrt(a))
    return R * c

def calculate_transport_emissions(weight_kg: float, distance_km: float) -> float:
    """
    Calculate heavy-duty truck transport emissions (Scope 3 logistics).
    Average heavy freight emission factor: ~0.107 kg CO2e per ton-kilometer.
    """
    weight_tons = weight_kg / 1000.0
    emission_factor_per_ton_km = 0.107  # kg CO2e / (ton * km)
    return round(weight_tons * distance_km * emission_factor_per_ton_km, 2)