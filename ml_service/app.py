"""
ML Service — Flask API
======================
Serves two trained models:

  POST /score    → MLP (Feedforward NN) — session effectiveness scoring
  POST /predict  → LSTM (PyTorch)       — next-day performance prediction
  GET  /health   → model status + architecture info
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os

# Must import these so pickle can deserialize the saved LSTM objects
from lstm_train import LSTMWrapper, LSTMPredictor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

BASE = os.path.dirname(os.path.abspath(__file__))

# ── Load MLP ──────────────────────────────────────────────────────────────────
try:
    with open(os.path.join(BASE, "mlp_model.pkl"), "rb") as f:
        mlp_model = pickle.load(f)
    with open(os.path.join(BASE, "scaler.pkl"), "rb") as f:
        scaler = pickle.load(f)
    MLP_LOADED = True
    print("[OK] MLP model loaded.")
except FileNotFoundError:
    MLP_LOADED = False
    print("[WARN] MLP model not found — run train_model.py first.")

# ── Load LSTM ─────────────────────────────────────────────────────────────────
try:
    with open(os.path.join(BASE, "lstm_model.pkl"), "rb") as f:
        lstm_model = pickle.load(f)
    LSTM_LOADED = True
    print("[OK] LSTM model loaded.")
except FileNotFoundError:
    LSTM_LOADED = False
    print("[WARN] LSTM model not found — run lstm_train.py first.")


# ── Health ────────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET", "OPTIONS"])
def health():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    lstm_metrics = lstm_model.metrics if LSTM_LOADED else {}

    return jsonify({
        "status": "ok",
        "models": {
            "mlp": {
                "loaded": MLP_LOADED,
                "type": "MLPRegressor (scikit-learn)",
                "architecture": "Input(7) → Dense(64,ReLU) → Dense(32,ReLU) → Dense(16,ReLU) → Output(1)",
                "task": "Session effectiveness scoring",
            },
            "lstm": {
                "loaded": LSTM_LOADED,
                "type": "Stacked LSTM (PyTorch)",
                "architecture": "Input(7×1) → LSTM(64,layers=2,dropout=0.2) → Dense(32,ReLU) → Dense(1,Sigmoid)",
                "task": "Next-day performance prediction",
                "trainable_params": 52_545,
                "training_sequences": 46_000,
                "metrics": {
                    "mse":  round(lstm_metrics.get("mse",  0), 6),
                    "rmse": round(lstm_metrics.get("rmse", 0), 6),
                    "mae":  round(lstm_metrics.get("mae",  0), 6),
                    "r2":   round(lstm_metrics.get("r2",   0), 4),
                },
            },
        },
    })


# ── MLP: session scoring ──────────────────────────────────────────────────────
@app.route("/score", methods=["POST"])
def score():
    if not MLP_LOADED:
        return jsonify({"error": "MLP model not loaded. Run train_model.py first."}), 503

    data = request.get_json()
    if not data or "sessions" not in data:
        return jsonify({"error": "Request body must contain 'sessions' array."}), 400

    sessions = data["sessions"]
    if not sessions:
        return jsonify({"scores": []})

    try:
        features = [[
            float(s.get("difficulty",        1)),
            float(s.get("days_until_review", 15)),
            float(s.get("past_hours",         0)),
            float(s.get("prev_confidence",    0)),
            float(s.get("topic_weight",     0.5)),
            float(s.get("hours_available",    4)),
            float(s.get("quiz_score",         0)),  # 0 = never quizzed
        ] for s in sessions]

        X = np.array(features)
        X_scaled = scaler.transform(X)
        raw = mlp_model.predict(X_scaled)
        scores = [round(float(np.clip(v, 0, 1)), 4) for v in raw]

        return jsonify({
            "scores": scores,
            "model_info": {
                "type": "MLPRegressor",
                "task": "Study session priority scoring",
                "layers": "6 → 64 → 32 → 16 → 1",
                "activation": "relu",
                "regularisation": "L2 + early stopping",
                "features": [
                    "difficulty", "days_until_review", "past_hours",
                    "prev_confidence", "topic_weight", "hours_available"
                ],
            },
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── LSTM: next-day prediction ─────────────────────────────────────────────────
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
            "type":        "LSTM (Long Short-Term Memory) — PyTorch",
            "framework":   "PyTorch 2.3",
            "architecture": "Input(7×1) → LSTM(64,layers=2,dropout=0.2) → Dense(32,ReLU) → Dense(1,Sigmoid)",
            "trainable_params": 52_545,
            "training_sequences": 46_000,
            "why_lstm": (
                "Solves the vanishing gradient problem of vanilla RNNs. "
                "Three gates (forget, input, output) control information flow "
                "through the cell state, enabling the model to learn long-range "
                "temporal dependencies in student study patterns."
            ),
            "gates": {
                "forget": "f_t = σ(W_f·[h_{t-1},x_t] + b_f)  — what to discard",
                "input":  "i_t = σ(W_i·[h_{t-1},x_t] + b_i)  — what new info to store",
                "output": "o_t = σ(W_o·[h_{t-1},x_t] + b_o)  — what to output",
                "cell":   "C_t = f_t⊙C_{t-1} + i_t⊙C̃_t       — updated cell state",
            },
            "metrics": lstm_model.metrics,
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
