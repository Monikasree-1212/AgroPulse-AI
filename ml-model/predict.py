import joblib
import os

_model_cache = {}

def _load_model(commodity):
    key = commodity.lower()
    if key not in _model_cache:
        filename = f"{key}_model.pkl"
        if not os.path.exists(filename):
            filename = "onion_model.pkl"
        _model_cache[key] = joblib.load(filename)
    return _model_cache[key]

def predict_price(commodity, day):
    model = _load_model(commodity)
    predicted = model.predict([[day]])[0]
    return round(float(predicted), 2)
