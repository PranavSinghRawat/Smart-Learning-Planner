"""
ML Service — Flask API
======================
Serves the trained MLP model for session effectiveness scoring.

POST /score
  Body: { "sessions": [ { "difficulty": 1, "days_to_exam": 7,
                           "past_hours": 3, "prev_confidence": 2.5,
                           "topic_weight": 0.8, "hours_available": 4 }, ... ] }
  Returns: { "scores": [0.72, 0.45, ...] }

GET /health
  Returns: { "status": "ok", "model": "MLP loaded" }
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os

# Import LSTM class so pickle can deserialize it
from lstm_train import SimpleLSTMPredictor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

BASE = os.path.dirname(os.path.abspath(__file__))

# Load MLP model and scaler at startup
try:
    with open(os.path.join(BASE, "mlp_model.pkl"), "rb") as f:
        model = pickle.load(f)
    with open(os.path.join(BASE, "scaler.pkl"), "rb") as f:
        scaler = pickle.load(f)
    MODEL_LOADED = True
    print("MLP model loaded successfully.")
except FileNotFoundError:
    MODEL_LOADED = False
    print("WARNING: MLP model not found. Run train_model.py first.")

# Load LSTM model at startup
try:
    with open(os.path.join(BASE, "lstm_model.pkl"), "rb") as f:
        lstm_model = pickle.load(f)
    LSTM_LOADED = True
    print("LSTM model loaded successfully.")
except FileNotFoundError:
    LSTM_LOADED = False
    print("WARNING: LSTM model not found. Run lstm_train.py first.")


@app.route("/health", methods=["GET", "OPTIONS"])
def health():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    return jsonify({
        "status": "ok",
        "model": "MLP loaded" if MODEL_LOADED else "Model not found — run train_model.py",
        "architecture": "Input(6) -> Dense(64,ReLU) -> Dense(32,ReLU) -> Dense(16,ReLU) -> Output(1)",
        "features": ["difficulty", "days_to_exam", "past_hours", "prev_confidence", "topic_weight", "hours_available"],
    })


@app.route("/score", methods=["POST"])
def score():
    if not MODEL_LOADED:
        return jsonify({"error": "Model not loaded. Run train_model.py first."}), 503

    data = request.get_json()
    if not data or "sessions" not in data:
        return jsonify({"error": "Request body must contain 'sessions' array."}), 400

    sessions = data["sessions"]
    if not sessions:
        return jsonify({"scores": []})

    try:
        features = []
        for s in sessions:
            features.append([
                float(s.get("difficulty", 1)),        # 0=easy,1=medium,2=hard
                float(s.get("days_to_exam", 15)),      # days remaining
                float(s.get("past_hours", 0)),         # hours already studied
                float(s.get("prev_confidence", 0)),    # last confidence (0-5)
                float(s.get("topic_weight", 0.5)),     # weak topic weight (0-1)
                float(s.get("hours_available", 4)),    # user's available hours today
            ])

        X = np.array(features)
        X_scaled = scaler.transform(X)
        raw_scores = model.predict(X_scaled)
        scores = [round(float(np.clip(s, 0, 1)), 4) for s in raw_scores]

        return jsonify({
            "scores": scores,
            "model_info": {
                "type": "MLPRegressor",
                "layers": "6 -> 64 -> 32 -> 16 -> 1",
                "activation": "relu",
                "regularisation": "L2 + early stopping",
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    if not LSTM_LOADED:
        return jsonify({"error": "LSTM model not loaded. Run lstm_train.py first."}), 503

    data = request.get_json()
    if not data or "scores" not in data:
        return jsonify({"error": "Request body must contain 'scores' array of 7 values."}), 400

    scores = data["scores"]
    if len(scores) != 7:
        return jsonify({"error": "Exactly 7 daily scores required (one per day)."}), 400

    try:
        scores = [float(s) for s in scores]
        result = lstm_model.predict_single(scores)
        result["model_info"] = {
            "type": "LSTM (Long Short-Term Memory)",
            "unit": "Deep Learning Unit III — Sequence Modeling",
            "architecture": "Input(7 timesteps) -> LSTM(64) -> Dropout(0.2) -> LSTM(32) -> Dense(16,ReLU) -> Output(1)",
            "why_lstm": "Solves vanishing gradient problem of vanilla RNNs using forget/input/output gates",
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
