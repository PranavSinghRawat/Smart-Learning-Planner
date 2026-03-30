"""
Deep Learning — LSTM (Long Short-Term Memory)
==============================================
Predicts a student's next-day study performance from their last 7 days of scores.

Why LSTM over vanilla RNN?
  Vanilla RNNs suffer from the vanishing gradient problem — gradients shrink
  to near-zero during backpropagation through time (BPTT), making it impossible
  to learn long-range dependencies.

  LSTM solves this with a gated cell state:
    Forget gate  : f_t = σ(W_f · [h_{t-1}, x_t] + b_f)
    Input gate   : i_t = σ(W_i · [h_{t-1}, x_t] + b_i)
    Cell update  : C̃_t = tanh(W_C · [h_{t-1}, x_t] + b_C)
    Cell state   : C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t
    Output gate  : o_t = σ(W_o · [h_{t-1}, x_t] + b_o)
    Hidden state : h_t = o_t ⊙ tanh(C_t)

Architecture:
  Input (7 timesteps, 1 feature)
    → LSTM(hidden=64, layers=2, dropout=0.2)
    → Dense(32, ReLU)
    → Dense(1, Sigmoid)
"""

import numpy as np
import pickle
import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

# ── Hyperparameters ───────────────────────────────────────────────────────────
SEQ_LEN      = 7
HIDDEN_SIZE  = 64
NUM_LAYERS   = 2
DROPOUT      = 0.2
BATCH_SIZE   = 64
EPOCHS       = 60
LR           = 1e-3
WEIGHT_DECAY = 1e-4
N_STUDENTS   = 2000


# ── Model definition (must be at module level for pickle) ─────────────────────
class LSTMPredictor(nn.Module):
    """
    Stacked LSTM for student performance sequence prediction.

    Architecture:
      Input (batch, 7, 1)
        → LSTM(64 units, 2 layers, dropout=0.2)   ← real gates, real BPTT
        → last hidden state (batch, 64)
        → Linear(64 → 32) + ReLU
        → Linear(32 → 1)  + Sigmoid
    """
    def __init__(self, input_size=1, hidden_size=HIDDEN_SIZE,
                 num_layers=NUM_LAYERS, dropout=DROPOUT):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_layers  = num_layers
        self.lstm = nn.LSTM(
            input_size  = input_size,
            hidden_size = hidden_size,
            num_layers  = num_layers,
            dropout     = dropout if num_layers > 1 else 0,
            batch_first = True,
        )
        self.head = nn.Sequential(
            nn.Linear(hidden_size, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid(),
        )

    def forward(self, x):
        out, (h_n, _) = self.lstm(x)
        last_hidden = h_n[-1]
        return self.head(last_hidden).squeeze(1)


class LSTMWrapper:
    """
    Serialisable wrapper around the trained PyTorch LSTM.
    Stores weights as numpy arrays so pickle works across files.
    """
    def __init__(self, pytorch_model, metrics):
        self.state_dict  = {k: v.numpy() for k, v in pytorch_model.state_dict().items()}
        self.metrics     = metrics
        self.hidden_size = HIDDEN_SIZE
        self.num_layers  = NUM_LAYERS
        self.dropout     = DROPOUT
        self._model      = None  # lazy-loaded

    def _load_model(self):
        if self._model is None:
            m = LSTMPredictor(
                hidden_size=self.hidden_size,
                num_layers=self.num_layers,
                dropout=self.dropout,
            )
            m.load_state_dict({k: torch.tensor(v) for k, v in self.state_dict.items()})
            m.eval()
            self._model = m
        return self._model

    def predict_single(self, last_7_scores):
        m = self._load_model()
        x = torch.tensor(last_7_scores, dtype=torch.float32).reshape(1, 7, 1)
        with torch.no_grad():
            score = float(np.clip(m(x).item(), 0, 1))

        trend      = last_7_scores[-1] - last_7_scores[0]
        recent_avg = float(np.mean(last_7_scores[-3:]))

        if score >= 0.65 and trend >= -0.05:
            status, color = "On Track", "green"
            message = "Great progress! Keep up the consistency."
        elif score >= 0.45 or trend > 0:
            status, color = "At Risk", "orange"
            message = "Performance needs attention. Increase study hours."
        else:
            status, color = "Needs Attention", "red"
            message = "Critical: Low performance trend. Focus on weak topics immediately."

        return {
            "predicted_score":      round(score, 4),
            "predicted_percentage": round(score * 100, 1),
            "status":       status,
            "color":        color,
            "message":      message,
            "trend":        round(float(trend), 4),
            "recent_avg":   round(recent_avg, 4),
            "input_sequence": last_7_scores,
        }


# ── Training (only runs when executed directly) ───────────────────────────────
if __name__ == "__main__":
    torch.manual_seed(42)
    np.random.seed(42)

    def generate_student_sequence(n=30, pattern="improving"):
        if pattern == "improving":
            base = np.linspace(0.3, 0.85, n)
        elif pattern == "declining":
            base = np.linspace(0.8, 0.25, n)
        else:
            base = np.ones(n) * np.random.uniform(0.4, 0.75)
        return np.clip(base + np.random.normal(0, 0.05, n), 0, 1)

    X_all, y_all = [], []
    for _ in range(N_STUDENTS):
        pattern = np.random.choice(["improving", "declining", "consistent"], p=[0.4, 0.3, 0.3])
        seq = generate_student_sequence(30, pattern)
        for i in range(len(seq) - SEQ_LEN):
            X_all.append(seq[i:i + SEQ_LEN])
            y_all.append(seq[i + SEQ_LEN])

    X_all = np.array(X_all, dtype=np.float32).reshape(-1, SEQ_LEN, 1)
    y_all = np.array(y_all, dtype=np.float32)
    split = int(0.8 * len(X_all))
    X_train, X_test = X_all[:split], X_all[split:]
    y_train, y_test = y_all[:split], y_all[split:]

    print("LSTM Study Performance Predictor — PyTorch")
    print("=" * 55)
    print(f"Total sequences  : {len(X_all):,}")
    print(f"Training samples : {len(X_train):,}")
    print(f"Test samples     : {len(X_test):,}")
    print()

    train_dl = DataLoader(TensorDataset(torch.from_numpy(X_train), torch.from_numpy(y_train)), batch_size=BATCH_SIZE, shuffle=True)
    test_dl  = DataLoader(TensorDataset(torch.from_numpy(X_test),  torch.from_numpy(y_test)),  batch_size=BATCH_SIZE)

    model      = LSTMPredictor().to("cpu")
    total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    optimizer  = torch.optim.Adam(model.parameters(), lr=LR, weight_decay=WEIGHT_DECAY)
    criterion  = nn.MSELoss()
    scheduler  = torch.optim.lr_scheduler.StepLR(optimizer, step_size=20, gamma=0.5)

    print(f"Architecture : Input(7×1) → LSTM(64,layers=2,dropout=0.2) → Dense(32,ReLU) → Dense(1,Sigmoid)")
    print(f"Parameters   : {total_params:,}")
    print()
    print(f"{'Epoch':>6}  {'Train Loss':>12}  {'Val Loss':>10}  {'Val R²':>8}")
    print("-" * 45)

    best_val_loss, best_state = float("inf"), None

    for epoch in range(1, EPOCHS + 1):
        model.train()
        train_loss = 0.0
        for xb, yb in train_dl:
            optimizer.zero_grad()
            loss = criterion(model(xb), yb)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            train_loss += loss.item() * len(xb)
        train_loss /= len(X_train)

        model.eval()
        val_loss, all_preds, all_targets = 0.0, [], []
        with torch.no_grad():
            for xb, yb in test_dl:
                pred = model(xb)
                val_loss += criterion(pred, yb).item() * len(xb)
                all_preds.append(pred.numpy())
                all_targets.append(yb.numpy())
        val_loss /= len(X_test)
        preds, targets = np.concatenate(all_preds), np.concatenate(all_targets)
        r2 = 1 - np.sum((targets - preds) ** 2) / np.sum((targets - targets.mean()) ** 2)

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            best_state = {k: v.clone() for k, v in model.state_dict().items()}

        scheduler.step()
        if epoch % 10 == 0 or epoch == 1:
            print(f"{epoch:>6}  {train_loss:>12.6f}  {val_loss:>10.6f}  {r2:>8.4f}")

    model.load_state_dict(best_state)
    model.eval()

    all_preds, all_targets = [], []
    with torch.no_grad():
        for xb, yb in test_dl:
            all_preds.append(model(xb).numpy())
            all_targets.append(yb.numpy())
    preds, targets = np.concatenate(all_preds), np.concatenate(all_targets)
    mse  = float(np.mean((targets - preds) ** 2))
    rmse = float(mse ** 0.5)
    mae  = float(np.mean(np.abs(targets - preds)))
    r2   = float(1 - np.sum((targets - preds) ** 2) / np.sum((targets - targets.mean()) ** 2))

    print(f"\nFinal → MSE:{mse:.6f}  RMSE:{rmse:.6f}  MAE:{mae:.6f}  R²:{r2:.4f}\n")

    wrapper = LSTMWrapper(model, {"mse": mse, "rmse": rmse, "mae": mae, "r2": r2})

    BASE = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(BASE, "lstm_model.pkl"), "wb") as f:
        pickle.dump(wrapper, f)
    print("LSTM model saved → ml_service/lstm_model.pkl")
