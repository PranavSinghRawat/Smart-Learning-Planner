"""
Deep Learning - Unit I: Feedforward Neural Network (MLP)
=========================================================
Trains a Multi-Layer Perceptron to score study session effectiveness.
Used by the Smart Learning Planner to decide which topic the student
should study TODAY based on their current study plan.

Architecture:
  Input (6 features) -> Dense(64, ReLU) -> Dense(32, ReLU)
  -> Dense(16, ReLU) -> Dense(1, Sigmoid)

Features per study session:
  1. difficulty        : 0=easy, 1=medium, 2=hard (set when generating plan)
  2. days_until_review : days remaining before the topic should be completed
  3. past_hours        : total hours already studied on this topic
  4. prev_confidence   : student's last self-rated confidence (0-5)
  5. topic_weight      : priority weight (0-1), higher = more important topic
  6. hours_available   : how many hours the student has available today

Target (priority_score):
  0.0 - 1.0  (higher = study this topic today, lower = can be done later)

Training data: synthetically generated using study planning domain rules,
then the MLP learns a smooth generalisation beyond the rules.
"""

import numpy as np
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import os

np.random.seed(42)
N = 5000  # synthetic samples

# ── Generate synthetic training data ─────────────────────────────────────────
difficulty        = np.random.randint(0, 3, N).astype(float)  # 0=easy,1=medium,2=hard
days_until_review = np.random.uniform(0, 30, N)               # 0-30 days
past_hours        = np.random.uniform(0, 20, N)               # 0-20h already studied
prev_confidence   = np.random.uniform(0, 5, N)                # 0-5 confidence rating
topic_weight      = np.random.uniform(0, 1, N)                # 0-1 topic importance
hours_available   = np.random.uniform(1, 8, N)                # 1-8h available today

X = np.column_stack([
    difficulty, days_until_review, past_hours,
    prev_confidence, topic_weight, hours_available
])

# ── Domain rules to generate ground-truth priority scores ────────────────────

# Rule 1: topics due soon → high priority
deadline_urgency = np.clip(1 - days_until_review / 30, 0, 1)

# Rule 2: low confidence → student needs more practice → higher priority
confidence_gap = np.clip(1 - prev_confidence / 5, 0, 1)

# Rule 3: high importance topics → higher priority
importance_score = topic_weight

# Rule 4: harder topics need more time — penalise if not enough hours today
difficulty_fit = np.where(
    difficulty == 2,
    np.clip(hours_available / 3, 0, 1),  # hard topic needs 3h+
    np.where(difficulty == 1,
             np.clip(hours_available / 2, 0, 1),  # medium needs 2h+
             np.ones(N))                           # easy fits any time
)

# Rule 5: diminishing returns — already studied a lot → lower priority
study_saturation = np.clip(1 - past_hours / 20, 0.1, 1)

# Weighted combination of all rules
y = (
    0.35 * deadline_urgency  +
    0.25 * confidence_gap    +
    0.20 * importance_score  +
    0.10 * difficulty_fit    +
    0.10 * study_saturation
)
y += np.random.normal(0, 0.03, N)  # small noise to prevent overfitting
y  = np.clip(y, 0, 1)

# ── Train / test split ────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── Standardise features ──────────────────────────────────────────────────────
scaler    = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

# ── MLP Architecture ──────────────────────────────────────────────────────────
mlp = MLPRegressor(
    hidden_layer_sizes=(64, 32, 16),  # 3 hidden layers
    activation='relu',                 # ReLU — prevents vanishing gradient
    solver='adam',                     # Adam optimiser
    alpha=0.001,                       # L2 regularisation — prevents overfitting
    batch_size=64,
    learning_rate='adaptive',
    max_iter=500,
    early_stopping=True,               # stops when validation loss stops improving
    validation_fraction=0.1,
    n_iter_no_change=20,
    random_state=42,
    verbose=False,
)

print("Training MLP — Study Session Priority Scorer")
print("=" * 55)
print(f"Architecture : Input(6) → Dense(64,ReLU) → Dense(32,ReLU) → Dense(16,ReLU) → Output(1)")
print(f"Regularisation: L2 (alpha=0.001) + Early Stopping")
print(f"Optimiser    : Adam (adaptive gradient descent)")
print(f"Training samples: {len(X_train)} | Test samples: {len(X_test)}")
print()

mlp.fit(X_train_s, y_train)

# ── Evaluate ──────────────────────────────────────────────────────────────────
y_pred = np.clip(mlp.predict(X_test_s), 0, 1)
mse    = mean_squared_error(y_test, y_pred)
r2     = r2_score(y_test, y_pred)

print(f"Training complete after {mlp.n_iter_} iterations")
print(f"MSE  : {mse:.4f}")
print(f"RMSE : {mse**0.5:.4f}")
print(f"R2   : {r2:.4f}")
print()

# ── Sample predictions ────────────────────────────────────────────────────────
print("Sample predictions:")
samples = [
    [2, 2,  1, 1.0, 0.9, 4],   # hard topic, due in 2 days, low confidence → HIGH priority
    [0, 25, 15, 4.5, 0.1, 2],  # easy topic, 25 days away, high confidence → LOW priority
    [1, 7,  5, 2.5, 0.6, 3],   # medium topic, 1 week left, moderate → MEDIUM priority
]
labels = [
    "Hard topic due soon, low confidence  (expect HIGH  ~0.8+)",
    "Easy topic, plenty of time, confident (expect LOW   ~0.2-)",
    "Medium topic, 1 week left, moderate   (expect MED   ~0.5)",
]
for s, label in zip(samples, labels):
    score = float(np.clip(mlp.predict(scaler.transform([s])), 0, 1)[0])
    print(f"  {label}")
    print(f"  [difficulty={s[0]}, days_until_review={s[1]}, past_hours={s[2]}, "
          f"confidence={s[3]}, topic_weight={s[4]}, hours_available={s[5]}]")
    print(f"  Priority Score: {score:.3f}")
    print()

# ── Save model + scaler ───────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE, "mlp_model.pkl"), "wb") as f:
    pickle.dump(mlp, f)
with open(os.path.join(BASE, "scaler.pkl"), "wb") as f:
    pickle.dump(scaler, f)

print("Model saved  → ml_service/mlp_model.pkl")
print("Scaler saved → ml_service/scaler.pkl")
print()
print("Feature summary (for teacher):")
print("  1. difficulty        — how hard is the topic (easy/medium/hard)")
print("  2. days_until_review — how many days before this topic must be done")
print("  3. past_hours        — hours already spent studying this topic")
print("  4. prev_confidence   — student's self-rated confidence (0-5)")
print("  5. topic_weight      — how important this topic is in the plan (0-1)")
print("  6. hours_available   — how many hours the student has today")
print()
print("Output: priority_score (0-1) — higher means study this topic today")
