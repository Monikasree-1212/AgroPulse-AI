# 🌾 AgroPulse AI

Smart Agricultural Market Intelligence Platform — powered by React, Node.js, MongoDB, and Machine Learning.

---

## Project Structure

```
AgroPulse-AI/
├── frontend/        React + Vite + Tailwind CSS + Recharts
├── backend/         Node.js + Express + MongoDB (Mongoose)
├── ml-model/        Python + Flask + scikit-learn
└── package.json     Root — runs frontend + backend concurrently
```

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS 4, Recharts, Axios |
| Backend    | Node.js, Express 5, MongoDB, Mongoose   |
| ML Server  | Python, Flask, scikit-learn, joblib     |
| Database   | MongoDB Atlas (cloud)                   |

---

## Prerequisites

- Node.js >= 18
- Python >= 3.9 (install from https://www.python.org/downloads/)
- MongoDB Atlas cluster (connection string ready)

---

## Setup & Installation

### 1. Clone / open the project

```bash
cd AgroPulse-AI
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 5. Install Python ML dependencies

```bash
cd ml-model
pip install -r requirements.txt
cd ..
```

### 6. Seed the MongoDB database (one-time)

```bash
cd backend
npm run seed
cd ..
```

### 7. Train the ML model (one-time)

```bash
cd ml-model
python train_model.py
cd ..
```

---

## Running the Project

### Option A — Run frontend + backend together (from root)

```bash
npm run dev
```

### Option B — Run each server separately

```bash
# Terminal 1 — Flask ML server (port 8000)
cd ml-model
python app.py

# Terminal 2 — Node.js backend (port 5000)
cd backend
npm run dev

# Terminal 3 — React frontend (port 5173)
cd frontend
npm run dev
```

---

## API Endpoints

### Node.js Backend (port 5000)

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| GET    | `/`                             | Health check                 |
| GET    | `/api/commodities/:name`        | Get commodity price history  |
| GET    | `/api/predict/:commodity/:day`  | Get ML price prediction      |

### Flask ML Server (port 8000)

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | `/predict/<commodity>/<int:day>`  | Raw ML model prediction  |

---

## Example API Responses

**GET /api/commodities/Onion**
```json
{
  "commodity": "Onion",
  "prices": [
    { "day": "Mon", "price": 22 },
    { "day": "Tue", "price": 24 }
  ]
}
```

**GET /api/predict/Onion/8**
```json
{
  "commodity": "Onion",
  "day": 8,
  "predictedPrice": 31.74,
  "confidence": 91
}
```

---

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
WEATHER_API_KEY=<your_openweather_api_key>
JWT_SECRET=<your_jwt_secret>
```

---

## Pages

| Route        | Page       | Description                        |
|--------------|------------|------------------------------------|
| `/`          | Home       | Landing page with features & CTA   |
| `/commodity` | Commodity  | Select a commodity to analyze      |
| `/dashboard` | Dashboard  | AI Prediction Dashboard            |

---

## Supported Commodities

- 🧅 Onion
- 🥔 Potato
- 🌾 Pulses
- 🌽 Maize

---

## Data Flow

```
React (5173)
  └── GET /api/commodities/:name  ──► Node.js (5000) ──► MongoDB
  └── GET /api/predict/:name/:day ──► Node.js (5000) ──► Flask (8000) ──► onion_model.pkl
```
