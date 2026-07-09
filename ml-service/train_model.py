import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, OrdinalEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def train():
    data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'historical_crop_prices.csv')
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return
        
    print("Loading historical crop prices dataset...")
    df = pd.read_csv(data_path)
    
    # Required Input Features:
    # Crop, State, District, Month, Season, Arrival Quantity, Rainfall, Temperature, Humidity, Fuel Price, Transport Cost, Supply Index, Demand Index
    # Target: Market Price (₹/kg)
    
    # We will map "Arrival Quantity (Tonnes)" -> Arrival Quantity
    df = df.rename(columns={
        "Arrival Quantity (Tonnes)": "Arrival Quantity",
        "Rainfall (mm)": "Rainfall",
        "Temperature (°C)": "Temperature",
        "Humidity (%)": "Humidity",
        "Market Price (₹/kg)": "Market Price",
        "Transport Cost (₹/kg)": "Transport Cost"
    })
    
    categorical_cols = ['Crop', 'State', 'District', 'Season']
    numerical_cols = ['Month', 'Arrival Quantity', 'Rainfall', 'Temperature', 'Humidity', 
                      'Fuel Price', 'Transport Cost', 'Supply Index', 'Demand Index']
    
    # Initialize Preprocessors
    encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
    scaler = StandardScaler()
    
    # Fit and transform
    print("Preprocessing data...")
    df[categorical_cols] = encoder.fit_transform(df[categorical_cols])
    df[numerical_cols] = scaler.fit_transform(df[numerical_cols])
    
    features = categorical_cols + numerical_cols
    X = df[features]
    y = df['Market Price']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Linear Regression...")
    lr_model = LinearRegression()
    lr_model.fit(X_train, y_train)
    lr_preds = lr_model.predict(X_test)
    
    print("\n--- Linear Regression Metrics ---")
    print(f"MAE:  {mean_absolute_error(y_test, lr_preds):.2f}")
    print(f"MSE:  {mean_squared_error(y_test, lr_preds):.2f}")
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, lr_preds)):.2f}")
    print(f"R²:   {r2_score(y_test, lr_preds):.2f}")
    
    print("\nTraining Random Forest Regressor...")
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    
    print("\n--- Random Forest Metrics ---")
    print(f"MAE:  {mean_absolute_error(y_test, rf_preds):.2f}")
    print(f"MSE:  {mean_squared_error(y_test, rf_preds):.2f}")
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, rf_preds)):.2f}")
    print(f"R²:   {r2_score(y_test, rf_preds):.2f}")
    
    print("\nSaving best model (Random Forest) and preprocessors to ml-service/ ...")
    with open('model.pkl', 'wb') as f:
        pickle.dump(rf_model, f)
    with open('encoder.pkl', 'wb') as f:
        pickle.dump(encoder, f)
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
        
    print("Success! model.pkl, encoder.pkl, scaler.pkl generated.")

if __name__ == '__main__':
    train()
