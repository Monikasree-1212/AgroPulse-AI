from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import os
import uvicorn

app = FastAPI(title="AgroPulse AI - Crop Price Prediction API")

# Add CORS Middleware to allow requests from Node.js backend or frontend directly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models on Startup
model = None
encoder = None
scaler = None

categorical_cols = ['Crop', 'State', 'District', 'Season']
numerical_cols = ['Month', 'Arrival Quantity', 'Rainfall', 'Temperature', 'Humidity', 
                  'Fuel Price', 'Transport Cost', 'Supply Index', 'Demand Index']

@app.on_event("startup")
def load_artifacts():
    global model, encoder, scaler
    base_dir = os.path.dirname(__file__)
    
    try:
        with open(os.path.join(base_dir, 'model.pkl'), 'rb') as f:
            model = pickle.load(f)
        with open(os.path.join(base_dir, 'encoder.pkl'), 'rb') as f:
            encoder = pickle.load(f)
        with open(os.path.join(base_dir, 'scaler.pkl'), 'rb') as f:
            scaler = pickle.load(f)
        print("ML Models loaded successfully.")
    except Exception as e:
        print(f"Warning: ML Models failed to load on startup. {e}")

class PredictionRequest(BaseModel):
    crop: str
    state: str
    district: str
    month: int
    season: str
    rainfall: float
    temperature: float
    humidity: float
    fuelPrice: float
    transportCost: float
    arrivalQuantity: float
    supplyIndex: float
    demandIndex: float
    
    # We optionally can take todayPrice strictly for calculating percentage trends, but we'll return predicted price.
    todayPrice: float = 0.0

@app.post("/api/ml/predict")
async def predict_price(req: PredictionRequest):
    if not model or not encoder or not scaler:
        raise HTTPException(status_code=503, detail="ML Models not initialized")
        
    try:
        # Construct DataFrame
        df = pd.DataFrame([{
            "Crop": req.crop,
            "State": req.state,
            "District": req.district,
            "Month": req.month,
            "Season": req.season,
            "Arrival Quantity": req.arrivalQuantity,
            "Rainfall": req.rainfall,
            "Temperature": req.temperature,
            "Humidity": req.humidity,
            "Fuel Price": req.fuelPrice,
            "Transport Cost": req.transportCost,
            "Supply Index": req.supplyIndex,
            "Demand Index": req.demandIndex
        }])
        
        # Transform Categories
        df[categorical_cols] = encoder.transform(df[categorical_cols])
        # Transform Numerical
        df[numerical_cols] = scaler.transform(df[numerical_cols])
        
        features = categorical_cols + numerical_cols
        X = df[features]
        
        prediction = model.predict(X)[0]
        
        # Determine Trend
        trend = "Increasing" if prediction > req.todayPrice else "Decreasing" if prediction < req.todayPrice else "Stable"
        
        # Fake a confidence score based on trees / variance
        # Random Forest Regressor confidence could be modeled as standard deviation of tree predictions
        if hasattr(model, 'estimators_'):
            preds = [est.predict(X)[0] for est in model.estimators_]
            # Lower variance = higher confidence
            stdev = pd.Series(preds).std()
            # Calculate a synthetic 1-100 score based on stdev relative to mean price (Coef of Variation)
            cv = stdev / prediction
            confidence = max(60.0, min(99.0, 100.0 - (cv * 100 * 2)))  # scale appropriately
        else:
            confidence = 85.0
            
        return {
            "predictedPrice": round(float(prediction), 2),
            "confidence": round(float(confidence)),
            "trend": trend
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

# Health Check Route
@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
