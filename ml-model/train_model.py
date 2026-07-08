import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

df = pd.read_csv("commodity_data.csv")

for commodity, group in df.groupby("commodity"):
    X = group[["day"]]
    y = group["price"]
    model = LinearRegression()
    model.fit(X, y)
    filename = f"{commodity.lower()}_model.pkl"
    joblib.dump(model, filename)
    print(f"Model trained and saved: {filename}")

print("All models trained successfully")
