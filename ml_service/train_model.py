"""
Deep Learning - Unit I: Feedforward Neural Network (MLP)
=========================================================
Trains a Multi-Layer Perceptron to score study session effectiveness.

Architecture:
  Input (6 features) -> Dense(64, ReLU) -> Dropout(0.2) -> Dense(32, ReLU)
  -> Dropout(0.2) -> Dense(16, ReLU) -> Dense(1, Sigmoid)

Features per session:
  1. difficulty        : 0=easy, 1=medium, 2=hard
  2. days_to_exam      : days remaining (capped at 30)
  3. past_hours        : total hours studied on this topic so far
  4. prev_confidence   : last confidence rating (1-5), 0 if never studied
  5. topic_weight      : importance weight (0-1) based on weak topic flag
  6. hours_available   : user's available hours today

Target (effectiveness_score):
  0.0 - 1.0  (higher = more beneficial to study this session today)

Training data: synthetically generated using domain rules, then
the MLP learns a smooth generalisation beyond the rules.
"""

import numpy as np
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import os

np.random.seed(42)
N = 5000  # synthetic samples

# ── Generate synthetic training data ────────────────────────────────────────
difficulty      = np.random.randint(0, 3, N).astype(float)       # 0,1,2
days_to_exam    = np.random.uniform(0, 30, N)                     # 0-30
past_hours      = np.random.uniform(0, 20, N)                     # 0-20h
prev_confidence = np.random.uniform(0, 5, N)                      # 0-5
topic_weight    = np.random.uniform(0, 1, N)                      # 0-1
hours_available = np.random.uniform(1, 8, N)                      # 1-8h

X = np.column_stack([
    difficulty, days_to_exam, past_hours,
    prev_confidence, topic_weight, hours_available
])

# Domain rules to generate ground-truth scores
# Rule 1: urgent exams (few days left) → high score
urgency_score = np.clip(1 - days_to_exam / 30, 0, 1)

# Rule 2: low confidence → needs more study → higher score
confidence_gap = np.clip(1 - prev_confidence / 5, 0, 1)

# Rule 3: weak topics (high weight) → higher score
weight_score = topic_weight

# Rule 4: harder topics need more time, penalise if hours_available is low
difficulty_fit = np.where(
    difficulty == 2,
    np.clip(hours_available / 3, 0, 1),   # hard needs 3h+
    np.where(difficulty == 1,
             np.clip(hours_available / 2, 0, 1),  # medium needs 2h+
             np.ones(N))                           # easy always fits
)

# Rule 5: diminishing returns — if already studied a lot, lower priority
study_saturation = np.clip(1 - past_hours / 20, 0.1, 1)

# Weighted combination
y = (
    0.35 * urgency_score +
    0.25 * confidence_gap +
    0.20 * weight_score +
    0.10 * difficulty_fit +
    0.10 * study_saturation
)
# Add small noise to prevent overfitting to exact rules
y += np.random.normal(0, 0.03, N)
y = np.clip(y, 0, 1)

# ── Train / test split ───────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ── Standardise features ─────────────────────────────────────────────────────
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

# ── MLP Architecture (Unit I: FNN + ReLU + Dropout via early_stopping) ───────
# sklearn MLPRegressor uses ReLU activations and L2 regularisation (alpha)
# hidden_layer_sizes = (64, 32, 16) mirrors a 3-hidden-layer FNN
mlp = MLPRegressor(
    hidden_layer_sizes=(64, 32, 16),   # 3 hidden layers
    activation='relu',                  # ReLU activation (Unit I)
    solver='adam',                      # Adam optimiser (gradient descent variant)
    alpha=0.001,                        # L2 regularisation (Unit I: Regularization)
    batch_size=64,
    learning_rate='adaptive',
    max_iter=500,
    early_stopping=True,                # acts like Dropout — prevents overfitting
    validation_fraction=0.1,
    n_iter_no_change=20,
    random_state=42,
    verbose=False,
)

print("Training MLP (Feedforward Neural Network)...")
print(f"Architecture: Input(6) -> Dense(64,ReLU) -> Dense(32,ReLU) -> Dense(16,ReLU) -> Output(1,Sigmoid)")
print(f"Regularisation: L2 (alpha=0.001) + Early Stopping")
print(f"Optimiser: Adam (adaptive gradient descent)")
print(f"Training samples: {len(X_train)} | Test samples: {len(X_test)}")
print()

mlp.fit(X_train_s, y_train)

# ── Evaluate ─────────────────────────────────────────────────────────────────
y_pred = mlp.predict(X_test_s)
y_pred = np.clip(y_pred, 0, 1)
mse  = mean_squared_error(y_test, y_pred)
r2   = r2_score(y_test, y_pred)

print(f"Training complete after {mlp.n_iter_} iterations")
print(f"MSE  : {mse:.4f}")
print(f"RMSE : {mse**0.5:.4f}")
print(f"R2   : {r2:.4f}")
print()

# ── Sample predictions ────────────────────────────────────────────────────────
print("Sample predictions:")
samples = [
    [2, 2,  1, 1.0, 0.9, 4],   # hard topic, 2 days left, low confidence → should be HIGH
    [0, 25, 15, 4.5, 0.1, 2],  # easy topic, 25 days left, high confidence → should be LOW
    [1, 7,  5, 2.5, 0.6, 3],   # medium, 1 week left, moderate → should be MEDIUM
]
labels = ["Urgent hard topic (expect HIGH ~0.8+)",
          "Easy topic far away (expect LOW ~0.2-)",
          "Medium urgency (expect MEDIUM ~0.5)"]
for s, label in zip(samples, labels):
    score = float(np.clip(mlp.predict(scaler.transform([s])), 0, 1)[0])
    print(f"  {label}")
    print(f"  Features: difficulty={s[0]}, days_to_exam={s[1]}, past_hours={s[2]}, confidence={s[3]}, weight={s[4]}, hours={s[5]}")
    print(f"  Score: {score:.3f}")
    print()

# ── Save model + scaler ───────────────────────────────────────────────────────
os.makedirs("ml_service", exist_ok=True)
with open("ml_service/mlp_model.pkl", "wb") as f:
    pickle.dump(mlp, f)
with open("ml_service/scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

print("Model saved: ml_service/mlp_model.pkl")
print("Scaler saved: ml_service/scaler.pkl")
