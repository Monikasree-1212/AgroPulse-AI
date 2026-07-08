from flask import Flask, jsonify
from predict import predict_price

app = Flask(__name__)

SUPPORTED = {"onion", "potato", "pulses", "maize", "coconut"}

@app.route("/predict/<commodity>/<int:day>", methods=["GET"])
def predict(commodity, day):
    name = commodity.capitalize() if commodity.lower() not in {"pulses"} else "Pulses"
    # Proper capitalisation for all commodities
    display = commodity.strip().title()
    prediction = predict_price(commodity, day)
    return jsonify({
        "commodity": display,
        "day": day,
        "predictedPrice": prediction,
        "confidence": 91
    })

if __name__ == "__main__":
    print("AI Prediction Server Running...")
    app.run(host="0.0.0.0", port=8000)
