"""
Deep Learning - Unit I: Feedforward Neural Network (MLP)
=========================================================
Trains a Multi-Layer Perceptron to score study session effectiveness.
Used by the Smart Learning Planner to decide which topic the student
should study TODAY based on their current study plan.

Architecture:
  Input (7 features) -> Dense(64, ReLU) -> Dense(32, ReLU)
  -> Dense(16, ReLU) -> Dense(1, Sigmoid)

Features per study session:
  1. difficulty        : 0=easy, 1=medium, 2=hard
  2. days_until_review : days remaining before topic must be completed
  3. past_hours        : total hours already studied on this topic
  4. prev_confidence   : student's self-rated confidence (0-5)
  5. topic_weight      : priority weight (0-1), higher = more important
  6. hours_available   : how many hours the student has today
  7. quiz_score        : last quiz score on this topic (0-1), 0 if never quizzed

Target (priority_score):
  0.0 - 1.0  (higher = study this topic today)
"""

import numpy as np
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import os

np.random.seed(42)
N = 5000

# ── Generate synthetic training data ─────────────────────────────────────────
difficulty        = np.random.randint(0, 3, N).astype(float)
days_until_review = np.random.uniform(0, 30, N)
past_hours        = np.random.uniform(0, 20, N)
prev_confidence   = np.random.uniform(0, 5, N)
topic_weight      = np.random.uniform(0, 1, N)
hours_available   = np.random.uniform(1, 8, N)
quiz_score        = np.random.uniform(0, 1, N)   # NEW: 0=never quizzed/failed, 1=perfect

X = np.column_stack([
    difficulty, days_until_review, past_hours,
    prev_confidence, topic_weight, hours_available, quiz_score
])

# ── Domain rules ──────────────────────────────────────────────────────────────
deadline_urgency = np.clip(1 - days_until_review / 30, 0, 1)
confidence_gap   = np.clip(1 - prev_confidence / 5, 0, 1)
importance_score = topic_weight
difficulty_fit   = np.where(
    difficulty == 2, np.clip(hours_available / 3, 0, 1),
    np.where(difficulty == 1, np.clip(hours_available / 2, 0, 1), np.ones(N))
)
study_saturation = np.clip(1 - past_hours / 20, 0.1, 1)
# Low quiz score = student didn't understand = higher priority to revisit
quiz_gap         = np.clip(1 - quiz_score, 0, 1)

y = (
    0.30 * deadline_urgency +
    0.20 * confidence_gap   +
    0.20 * quiz_gap         +   # quiz performance now drives priority
    0.15 * importance_score +
    0.10 * difficulty_fit   +
    0.05 * study_saturation
)
y += np.random.normal(0, 0.03, N)
y  = np.clip(y, 0, 1)

# ── Train / test split ────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler    = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

# ── MLP ───────────────────────────────────────────────────────────────────────
mlp = MLPRegressor(
    hidden_layer_sizes=(64, 32, 16),
    activation='relu',
    solver='adam',
    alpha=0.001,
    batch_size=64,
    learning_rate='adaptive',
    max_iter=500,
    early_stopping=True,
    validation_fraction=0.1,
    n_iter_no_change=20,
    random_state=42,
    verbose=False,
)

print("Training MLP — Study Session Priority Scorer (with Quiz Score)")
print("=" * 60)
print(f"Architecture : Input(7) → Dense(64,ReLU) → Dense(32,ReLU) → Dense(16,ReLU) → Output(1,Sigmoid)")
print(f"New feature  : quiz_score — student's last quiz result on this topic")
print(f"Training samples: {len(X_train)} | Test samples: {len(X_test)}")
print()

mlp.fit(X_train_s, y_train)

y_pred = np.clip(mlp.predict(X_test_s), 0, 1)
mse    = mean_squared_error(y_test, y_pred)
r2     = r2_score(y_test, y_pred)

print(f"Training complete after {mlp.n_iter_} iterations")
print(f"MSE  : {mse:.4f} | RMSE : {mse**0.5:.4f} | R2 : {r2:.4f}")
print()

# ── Sample predictions ────────────────────────────────────────────────────────
print("Sample predictions:")
samples = [
    [2, 2,  1, 1.0, 0.9, 4, 0.3],  # hard, due soon, failed quiz → HIGH
    [0, 25, 15, 4.5, 0.1, 2, 0.9], # easy, far away, aced quiz → LOW
    [1, 7,  5, 2.5, 0.6, 3, 0.6],  # medium, 1 week, average quiz → MED
]
labels = [
    "Hard topic due soon, failed quiz  (expect HIGH ~0.8+)",
    "Easy topic, far away, aced quiz   (expect LOW  ~0.2-)",
    "Medium topic, 1 week, avg quiz    (expect MED  ~0.5)",
]
for s, label in zip(samples, labels):
    score = float(np.clip(mlp.predict(scaler.transform([s])), 0, 1)[0])
    print(f"  {label}")
    print(f"  Priority Score: {score:.3f}")
    print()

# ── Save ──────────────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE, "mlp_model.pkl"), "wb") as f:
    pickle.dump(mlp, f)
with open(os.path.join(BASE, "scaler.pkl"), "wb") as f:
    pickle.dump(scaler, f)

print("Model saved  → ml_service/mlp_model.pkl")
print("Scaler saved → ml_service/scaler.pkl")
