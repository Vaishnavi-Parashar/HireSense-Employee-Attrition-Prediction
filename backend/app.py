import os
import json
import logging
import traceback
import urllib.request
import urllib.error
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("HireSenseAPI")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
CSV_PATH = r"C:\Users\nakul\Documents\ML_training\realistic_employee_attrition.csv"

# Global cache for models and scaler
model_cache = {}
scaler_instance = None
df_cache = None

MODEL_FILE_MAP = {
    "Random Forest": "rf_model.joblib",
    "Gradient Boosting": "gb_model.joblib",
    "XGBoost": "xgb_model.joblib",
    "KNN": "knn_model.joblib"
}

FEATURE_ORDER = [
    'Age', 'JobLevel', 'MonthlyIncome', 'YearsAtCompany',
    'StockOptionLevel', 'DistanceFromHome', 'OverTime',
    'WorkLifeBalance', 'JobSatisfaction'
]

COLS_TO_SCALE = ['Age', 'MonthlyIncome', 'YearsAtCompany', 'DistanceFromHome']

def load_scaler():
    global scaler_instance
    if scaler_instance is None:
        scaler_path = os.path.join(MODELS_DIR, "scaler.joblib")
        if os.path.exists(scaler_path):
            scaler_instance = joblib.load(scaler_path)
            logger.info(f"Loaded scaler from {scaler_path}")
        else:
            logger.error(f"Scaler path not found: {scaler_path}")
    return scaler_instance

def get_model(model_name):
    if model_name not in MODEL_FILE_MAP:
        return None, f"Invalid model name '{model_name}'. Choose from: {list(MODEL_FILE_MAP.keys())}"
    
    if model_name not in model_cache:
        file_path = os.path.join(MODELS_DIR, MODEL_FILE_MAP[model_name])
        if not os.path.exists(file_path):
            return None, f"Model file '{MODEL_FILE_MAP[model_name]}' not found. Run training script first."
        model_cache[model_name] = joblib.load(file_path)
        logger.info(f"Loaded model '{model_name}' from {file_path}")
        
    return model_cache[model_name], None

def load_df():
    global df_cache
    if df_cache is None and os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
        df.drop_duplicates(inplace=True)
        df.columns = df.columns.str.strip()
        df_cache = df
    return df_cache

# --- GLOBAL ERROR HANDLERS TO ALWAYS RETURN VALID JSON ---
@app.errorhandler(Exception)
def handle_general_exception(e):
    logger.error(f"Unhandled Exception: {str(e)}\n{traceback.format_exc()}")
    response = jsonify({
        "error": f"Internal Server Error: {str(e)}"
    })
    response.status_code = 500
    response.headers["Content-Type"] = "application/json"
    return response

@app.errorhandler(404)
def handle_404(e):
    response = jsonify({"error": "Requested endpoint was not found on server"})
    response.status_code = 404
    response.headers["Content-Type"] = "application/json"
    return response

@app.errorhandler(400)
def handle_400(e):
    response = jsonify({"error": f"Bad Request: {str(e)}"})
    response.status_code = 400
    response.headers["Content-Type"] = "application/json"
    return response

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "HireSense AI Engine API",
        "version": "1.0.0"
    })

@app.route('/api/metrics', methods=['GET'])
def metrics():
    metrics_path = os.path.join(MODELS_DIR, "metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            data = json.load(f)
        return jsonify(data)
    return jsonify({"error": "Metrics file not found"}), 404

@app.route('/api/summary', methods=['GET'])
def summary():
    summary_path = os.path.join(MODELS_DIR, "summary.json")
    if os.path.exists(summary_path):
        with open(summary_path, "r") as f:
            data = json.load(f)
        return jsonify(data)
    
    df = load_df()
    if df is not None:
        attrition_count = int((df["Attrition"] == "Yes").sum())
        total = len(df)
        return jsonify({
            "total_records": total,
            "total_attrition": attrition_count,
            "total_retained": total - attrition_count,
            "attrition_rate_pct": round((attrition_count / total) * 100, 2),
            "avg_age": round(float(df["Age"].mean()), 1),
            "avg_income": round(float(df["MonthlyIncome"].mean()), 2),
            "avg_years": round(float(df["YearsAtCompany"].mean()), 1)
        })
    return jsonify({"error": "Dataset not loaded"}), 404

@app.route('/api/employees', methods=['GET'])
def get_employees():
    df = load_df()
    if df is None:
        return jsonify({"error": "Dataset unavailable"}), 404

    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    search = request.args.get('search', '', type=str).strip().lower()
    attrition_filter = request.args.get('attrition', '', type=str).strip()

    filtered_df = df.copy()

    if attrition_filter:
        filtered_df = filtered_df[filtered_df['Attrition'].str.lower() == attrition_filter.lower()]

    if search:
        mask = (
            filtered_df['JobLevel'].astype(str).str.contains(search) |
            filtered_df['MonthlyIncome'].astype(str).str.contains(search) |
            filtered_df['Age'].astype(str).str.contains(search)
        )
        filtered_df = filtered_df[mask]

    total_records = len(filtered_df)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit

    sliced_df = filtered_df.iloc[start_idx:end_idx].copy()
    records = sliced_df.to_dict(orient='records')

    for idx, rec in enumerate(records):
        rec['emp_id'] = f"EMP-{start_idx + idx + 1001}"
        if rec['OverTime'] == 'Yes' and rec['JobSatisfaction'] <= 2:
            rec['risk_level'] = 'High'
        elif rec['OverTime'] == 'Yes' or rec['JobSatisfaction'] <= 2:
            rec['risk_level'] = 'Medium'
        else:
            rec['risk_level'] = 'Low'

    return jsonify({
        "total": total_records,
        "page": page,
        "limit": limit,
        "employees": records
    })

@app.route('/api/predict', methods=['OPTIONS', 'POST'])
def predict():
    if request.method == 'OPTIONS':
        response = make_response(jsonify({"status": "ok"}), 200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response

    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            logger.warning("Empty or non-JSON body received in /api/predict")
            return jsonify({"error": "Invalid or missing JSON payload in request body"}), 400

        model_name = data.get("model_name", "Gradient Boosting")
        features = data.get("features", {})

        logger.info(f"Prediction Request - Model: '{model_name}', Features: {features}")

        model, err = get_model(model_name)
        if err:
            logger.error(f"Model error: {err}")
            return jsonify({"error": err}), 400

        scaler = load_scaler()
        if scaler is None:
            logger.error("Scaler artifact not available")
            return jsonify({"error": "Scaler artifact not loaded on backend server"}), 500

        raw_overtime = features.get("OverTime", "No")
        overtime_val = 1 if str(raw_overtime).strip().lower() in ["yes", "1", "true"] else 0

        input_dict = {
            "Age": float(features.get("Age", 35)),
            "JobLevel": int(features.get("JobLevel", 2)),
            "MonthlyIncome": float(features.get("MonthlyIncome", 6000)),
            "YearsAtCompany": float(features.get("YearsAtCompany", 5)),
            "StockOptionLevel": int(features.get("StockOptionLevel", 1)),
            "DistanceFromHome": float(features.get("DistanceFromHome", 10)),
            "OverTime": overtime_val,
            "WorkLifeBalance": int(features.get("WorkLifeBalance", 3)),
            "JobSatisfaction": int(features.get("JobSatisfaction", 3))
        }

        raw_df = pd.DataFrame([input_dict])[FEATURE_ORDER]

        scaled_df = raw_df.copy()
        scaled_df[COLS_TO_SCALE] = scaler.transform(raw_df[COLS_TO_SCALE])

        prediction_binary = int(model.predict(scaled_df)[0])
        has_proba = hasattr(model, "predict_proba")

        probability = None
        if has_proba:
            probabilities = model.predict_proba(scaled_df)[0]
            probability = float(probabilities[1])

        if probability is not None:
            prob_float = round(probability, 4)
            prob_pct = round(probability * 100, 2)
            if probability >= 0.60 or prediction_binary == 1:
                risk = "High"
                risk_level = "High Risk"
            elif probability >= 0.35:
                risk = "Medium"
                risk_level = "Medium Risk"
            else:
                risk = "Low"
                risk_level = "Low Risk"
        else:
            prob_float = 1.0 if prediction_binary == 1 else 0.0
            prob_pct = 100.0 if prediction_binary == 1 else 0.0
            risk = "High" if prediction_binary == 1 else "Low"
            risk_level = "High Risk" if prediction_binary == 1 else "Low Risk"

        prediction_text = "Attrition (Yes)" if prediction_binary == 1 else "Retained (No)"

        xai_factors = []
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            feature_imp = list(zip(FEATURE_ORDER, importances))
            feature_imp.sort(key=lambda x: x[1], reverse=True)

            for feat, imp in feature_imp[:5]:
                val = input_dict[feat]
                formatted_val = "Yes" if feat == "OverTime" and val == 1 else ("No" if feat == "OverTime" and val == 0 else str(val))
                xai_factors.append({
                    "feature": feat,
                    "importance_pct": round(float(imp) * 100, 2),
                    "user_value": formatted_val,
                    "impact": "High" if imp > 0.15 else "Moderate"
                })

        result_payload = {
            "prediction": prediction_binary,
            "probability": prob_float,
            "risk": risk,
            "risk_level": risk_level,
            "prediction_text": prediction_text,
            "probability_pct": prob_pct,
            "model_used": model_name,
            "has_probability": has_proba,
            "xai_factors": xai_factors,
            "input_processed": input_dict
        }

        logger.info(f"Prediction Output: prediction={prediction_binary}, probability={prob_float}, risk='{risk}'")
        return jsonify(result_payload)

    except Exception as e:
        logger.error(f"Prediction Exception: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": f"Prediction computation failed: {str(e)}"}), 500

# --- OLLAMA LOCAL AI CHAT ENDPOINT ---
@app.route('/api/ai/chat', methods=['OPTIONS', 'POST'])
def ai_chat():
    if request.method == 'OPTIONS':
        response = make_response(jsonify({"status": "ok"}), 200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response

    try:
        data = request.get_json(force=True, silent=True) or {}
        user_message = data.get("message", "").strip()
        history = data.get("history", [])
        context = data.get("context", None)

        if not user_message:
            return jsonify({"response": "Please enter a question or message.", "error": False})

        SYSTEM_PROMPT = (
            "You are the AI Assistant for an Employee Attrition Prediction and HR Analytics system.\n\n"
            "You help users understand:\n"
            "- Employee attrition\n"
            "- Attrition risk predictions\n"
            "- Employee characteristics\n"
            "- Factors that may contribute to employee turnover\n"
            "- Model predictions\n"
            "- Retention strategies\n"
            "- HR analytics\n"
            "- Employee performance and workplace factors\n"
            "- How to interpret the ML model's results\n\n"
            "Give clear, practical and easy-to-understand answers.\n\n"
            "Do not claim that a prediction is certain.\n"
            "Do not invent employee information.\n"
            "If information is not available, clearly say that it is unavailable.\n\n"
            "When discussing an employee's attrition prediction, distinguish between:\n"
            "1. ML model prediction\n"
            "2. Probability/risk score\n"
            "3. Possible contributing factors\n\n"
            "Do not make sensitive or discriminatory decisions about employees.\n"
            "Do not recommend firing or rejecting employees solely based on an ML prediction.\n\n"
            "You are an assistant for decision support, not a replacement for HR professionals."
        )

        full_system_prompt = SYSTEM_PROMPT

        if context and isinstance(context, dict):
            emp = context.get("employee", {})
            pred = context.get("prediction", {})
            context_str = (
                "\n\nCURRENT PREDICTION CONTEXT FOR THIS CONVERSATION:\n"
                f"- Age: {emp.get('age', emp.get('Age', 'N/A'))}\n"
                f"- Job Level: {emp.get('jobLevel', emp.get('JobLevel', 'N/A'))}\n"
                f"- Monthly Income: ${emp.get('monthlyIncome', emp.get('MonthlyIncome', 'N/A'))}\n"
                f"- Years At Company: {emp.get('yearsAtCompany', emp.get('YearsAtCompany', 'N/A'))}\n"
                f"- Distance From Home: {emp.get('distanceFromHome', emp.get('DistanceFromHome', 'N/A'))} miles\n"
                f"- OverTime Requirements: {emp.get('overtime', emp.get('OverTime', 'N/A'))}\n"
                f"- Stock Option Level: {emp.get('stockOptionLevel', emp.get('StockOptionLevel', 'N/A'))}\n"
                f"- Work-Life Balance Rating: {emp.get('workLifeBalance', emp.get('WorkLifeBalance', 'N/A'))} / 4\n"
                f"- Job Satisfaction Rating: {emp.get('jobSatisfaction', emp.get('JobSatisfaction', 'N/A'))} / 4\n\n"
                "ML MODEL PREDICTION OUTPUT:\n"
                f"- Model Used: {pred.get('model_used', 'Trained ML Model')}\n"
                f"- Prediction Output: {pred.get('label', pred.get('prediction_text', 'N/A'))}\n"
                f"- Risk Level: {pred.get('risk', pred.get('risk_level', 'N/A'))} Risk\n"
                f"- Attrition Probability Score: {pred.get('probability', pred.get('probability_pct', 'N/A'))}\n"
            )
            full_system_prompt += context_str

        formatted_messages = [{"role": "system", "content": full_system_prompt}]

        for h in history:
            role = h.get("role")
            content = h.get("content")
            if role in ["user", "assistant"] and content:
                formatted_messages.append({"role": role, "content": content})

        formatted_messages.append({"role": "user", "content": user_message})

        ollama_payload = {
            "model": "qwen3:4b",
            "messages": formatted_messages,
            "stream": False
        }

        logger.info(f"Posting request to local Ollama qwen3:4b (messages count={len(formatted_messages)})")

        req = urllib.request.Request(
            "http://localhost:11434/api/chat",
            data=json.dumps(ollama_payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )

        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                res_data = json.loads(resp.read().decode('utf-8'))
                ai_text = res_data.get('message', {}).get('content', '').strip()
                if not ai_text:
                    ai_text = "No response text received from local Ollama model."
                logger.info("Received response successfully from local Ollama qwen3:4b")
                return jsonify({"response": ai_text, "model": "qwen3:4b"})
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            logger.error(f"Local Ollama connection failed: {e}")
            return jsonify({
                "response": "AI Assistant is unavailable. Please make sure Ollama is running locally.",
                "error": True
            }), 200

    except Exception as e:
        logger.error(f"Error in /api/ai/chat: {e}\n{traceback.format_exc()}")
        return jsonify({
            "response": "AI Assistant is unavailable. Please make sure Ollama is running locally.",
            "error": True
        }), 200

if __name__ == '__main__':
    print("Starting HireSense Backend Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
