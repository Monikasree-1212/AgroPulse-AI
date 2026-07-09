import csv
import random
import math
from datetime import datetime, timedelta

# Constants
START_DATE = datetime(2020, 1, 1)
END_DATE = datetime(2025, 12, 31)
NUM_RECORDS = 15000

CROPS = [
    "Coconut", "Onion", "Tomato", "Potato", "Paddy", "Wheat", "Maize", "Cotton",
    "Groundnut", "Soybean", "Mustard", "Gram (Chana)", "Tur (Arhar)", "Moong",
    "Urad", "Bajra", "Jowar", "Ragi", "Sunflower"
]

CROP_BASES = {
    "Coconut": 30, "Onion": 25, "Tomato": 20, "Potato": 18, "Paddy": 22,
    "Wheat": 24, "Maize": 21, "Cotton": 60, "Groundnut": 55, "Soybean": 45,
    "Mustard": 50, "Gram (Chana)": 48, "Tur (Arhar)": 65, "Moong": 70,
    "Urad": 75, "Bajra": 20, "Jowar": 22, "Ragi": 25, "Sunflower": 50
}

LOCATIONS = {
    "Tamil Nadu": {
        "Coimbatore": ["Mettupalayam Market", "Coimbatore APMC"],
        "Madurai": ["Paravai Market", "Madurai Central"],
        "Salem": ["Salem APMC"],
        "Erode": ["Erode Market"],
        "Tiruppur": ["Palladam Market"],
        "Trichy": ["Gandhi Market"],
        "Thanjavur": ["Thanjavur APMC"]
    },
    "Kerala": {
        "Thrissur": ["Thrissur Market"],
        "Palakkad": ["Palakkad APMC"],
        "Ernakulam": ["Ernakulam Central"],
        "Kannur": ["Kannur Market"]
    },
    "Karnataka": {
        "Mysuru": ["Mysuru APMC"],
        "Bengaluru": ["Yeshwanthpur APMC", "K.R. Market"],
        "Hubli": ["Hubli APMC"],
        "Belagavi": ["Belagavi Market"]
    },
    "Andhra Pradesh": {
        "Guntur": ["Guntur APMC"],
        "Kurnool": ["Kurnool Market"],
        "Chittoor": ["Chittoor APMC"]
    },
    "Telangana": {
        "Hyderabad": ["Bowenpally Market", "Kukatpally APMC"],
        "Warangal": ["Enumamula APMC"],
        "Karimnagar": ["Karimnagar APMC"]
    },
    "Maharashtra": {
        "Nashik": ["Lasalgaon APMC", "Pimpalgaon"],
        "Pune": ["Pune APMC"],
        "Nagpur": ["Kalamna Market"],
        "Mumbai": ["Vashi APMC"]
    },
    "Gujarat": {
        "Ahmedabad": ["Ahmedabad APMC"],
        "Rajkot": ["Rajkot Market"],
        "Surat": ["Surat APMC"]
    },
    "Punjab": {
        "Ludhiana": ["Ludhiana APMC"],
        "Amritsar": ["Amritsar Market"],
        "Jalandhar": ["Jalandhar APMC"]
    },
    "Haryana": {
        "Karnal": ["Karnal APMC"],
        "Panipat": ["Panipat Market"],
        "Rohtak": ["Rohtak APMC"]
    },
    "Uttar Pradesh": {
        "Lucknow": ["Lucknow Mandi"],
        "Agra": ["Agra APMC"],
        "Kanpur": ["Kanpur Mandi"],
        "Varanasi": ["Varanasi APMC"]
    }
}

FESTIVAL_MONTHS = [1, 8, 10, 11] # Jan (Pongal/Makar Sankranti), Aug (Onam/Raksha Bandhan), Oct (Dussehra), Nov (Diwali)

def get_season(month):
    if month in [12, 1, 2]: return "Winter"
    if month in [3, 4, 5]: return "Summer"
    if month in [6, 7, 8, 9]: return "Monsoon"
    return "Post-Monsoon"

def random_date(start, end):
    delta = end - start
    random_days = random.randrange(delta.days)
    return start + timedelta(days=random_days)

def generate_row():
    date = random_date(START_DATE, END_DATE)
    month = date.month
    year = date.year
    season = get_season(month)
    
    state = random.choice(list(LOCATIONS.keys()))
    district = random.choice(list(LOCATIONS[state].keys()))
    mandi = random.choice(LOCATIONS[state][district])
    
    crop = random.choice(CROPS)
    base_price = CROP_BASES[crop]
    
    # Season & Weather multipliers
    weather_mult = 1.0
    rainfall = random.uniform(0, 10)
    temp = random.uniform(15, 35)
    humidity = random.uniform(30, 90)
    
    if season == "Summer":
        temp = random.uniform(30, 45)
        humidity = random.uniform(20, 60)
        if crop == "Tomato": weather_mult += random.uniform(0.1, 0.4) # Tomatoes spoil/price up
    elif season == "Monsoon":
        temp = random.uniform(25, 35)
        humidity = random.uniform(70, 100)
        rainfall = random.uniform(50, 200)
        if crop == "Onion": weather_mult += random.uniform(0.2, 0.6) # Onions spoil in rain
    elif season == "Winter":
        temp = random.uniform(5, 25)
        humidity = random.uniform(40, 70)
        if crop == "Wheat": weather_mult -= 0.1 # Plentiful
        
    harvest_months = {"Paddy": [10, 11, 12, 1], "Wheat": [4, 5], "Maize": [9, 10], "Cotton": [10, 11, 12]}
    if crop in harvest_months and month in harvest_months[crop]:
        weather_mult -= random.uniform(0.1, 0.3) # Harvest drops prices
        supply_mult = random.uniform(1.2, 1.8)
    else:
        supply_mult = random.uniform(0.5, 1.1)
        
    is_festival = "Yes" if month in FESTIVAL_MONTHS and random.random() > 0.3 else "No"
    if is_festival == "Yes" and crop not in ["Cotton", "Jowar", "Bajra"]:
        weather_mult += random.uniform(0.05, 0.15)
        demand_mult = random.uniform(1.3, 1.8)
    else:
        demand_mult = random.uniform(0.6, 1.2)
        
    # State tax/transport variance
    state_mult = 1.0 + (list(LOCATIONS.keys()).index(state) * 0.01)
    
    # Years inflation (2020-2025)
    inflation_mult = 1.0 + ((year - 2020) * 0.04)
    
    # Calculate final factors
    supply_index = round(supply_mult * 100)
    demand_index = round(demand_mult * 100)
    
    # Raw price
    curr_price = base_price * weather_mult * state_mult * inflation_mult * (demand_mult / supply_mult)
    curr_price = round(max(curr_price, base_price * 0.5), 2)
    
    # Fluctuations for min/max
    min_price = round(curr_price * random.uniform(0.85, 0.95), 2)
    max_price = round(curr_price * random.uniform(1.05, 1.20), 2)
    
    distance = random.randint(10, 300)
    fuel_price = round(85 + ((year - 2020) * 2) + random.uniform(-3, 3), 2)
    transport_cost = round((distance * fuel_price * 0.005) / 100, 2)
    
    arrival_quantity = round(random.uniform(10, 500) * supply_mult, 1)

    return [
        date.strftime("%Y-%m-%d"), state, district, mandi, crop, season, month, year,
        arrival_quantity, curr_price, min_price, max_price, 
        round(rainfall, 1), round(temp, 1), round(humidity, 1), 
        fuel_price, transport_cost, distance, is_festival, supply_index, demand_index
    ]

def generate_csv(filename):
    headers = [
        "Date", "State", "District", "Mandi", "Crop", "Season", "Month", "Year", 
        "Arrival Quantity (Tonnes)", "Market Price (₹/kg)", "Minimum Price", "Maximum Price", 
        "Rainfall (mm)", "Temperature (°C)", "Humidity (%)", "Fuel Price", 
        "Transport Cost (₹/kg)", "Distance (km)", "Festival Season", "Supply Index", "Demand Index"
    ]
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        
        seen = set() # Avoid duplicates
        
        count = 0
        while count < NUM_RECORDS:
            row = generate_row()
            # Simple identity string for uniqueness (Date + Mandi + Crop)
            row_id = f"{row[0]}-{row[3]}-{row[4]}"
            if row_id not in seen:
                seen.add(row_id)
                writer.writerow(row)
                count += 1
                
    print(f"Successfully generated {NUM_RECORDS} records to {filename}.")

if __name__ == "__main__":
    generate_csv('historical_crop_prices.csv')
