import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def train_pipeline():
    csv_path = r"C:\Users\nakul\Documents\ML_training\realistic_employee_attrition.csv"
    output_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(output_dir, exist_ok=True)

    print(f"Loading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)
    df.drop_duplicates(inplace=True)
    df.columns = df.columns.str.strip()

    # Preprocessing as in 10features.py
    for col in ["OverTime", "Attrition"]:
        df[col] = df[col].replace({"Yes": 1, "No": 0})

    cols_to_scale = ['Age', 'MonthlyIncome', 'YearsAtCompany', 'DistanceFromHome']
    scaler = StandardScaler()
    
    # We fit scaler on dataframe continuous columns
    scaler.fit(df[cols_to_scale])
    
    # Create scaled version for training
    df_scaled = df.copy()
    df_scaled[cols_to_scale] = scaler.transform(df[cols_to_scale])

    X = df_scaled.drop('Attrition', axis=1)
    y = df_scaled['Attrition']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, random_state=42, test_size=0.2, stratify=y
    )

    # Remove outliers on YearsAtCompany in X_train as per 10features.py
    Q1 = X_train['YearsAtCompany'].quantile(0.25)
    Q3 = X_train['YearsAtCompany'].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    mask = (X_train['YearsAtCompany'] >= lower_bound) & (X_train['YearsAtCompany'] <= upper_bound)
    X_train = X_train[mask]
    y_train = y_train[mask]

    models = {
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(random_state=42, n_estimators=100),
        "XGBoost": XGBClassifier(random_state=42, eval_metric="logloss", n_estimators=120),
        "KNN": KNeighborsClassifier(n_neighbors=276)
    }

    file_keys = {
        "Random Forest": "rf_model.joblib",
        "Gradient Boosting": "gb_model.joblib",
        "XGBoost": "xgb_model.joblib",
        "KNN": "knn_model.joblib"
    }

    metrics_result = {}

    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        auc = float(roc_auc_score(y_test, y_proba)) if y_proba is not None else 0.0
        cm = confusion_matrix(y_test, y_pred).tolist()

        metrics_result[name] = {
            "name": name,
            "file": file_keys[name],
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1": round(f1, 4),
            "auc": round(auc, 4),
            "confusion_matrix": cm,
            "is_best": name == "Gradient Boosting"
        }

        # Save model file
        model_path = os.path.join(output_dir, file_keys[name])
        joblib.dump(model, model_path)
        print(f"Saved {name} to {model_path}")

    # Save fitted scaler
    scaler_path = os.path.join(output_dir, "scaler.joblib")
    joblib.dump(scaler, scaler_path)
    print(f"Saved scaler to {scaler_path}")

    # Save metrics JSON
    metrics_path = os.path.join(output_dir, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_result, f, indent=2)
    print(f"Saved metrics to {metrics_path}")

    # Dataset summary stats
    dataset_summary = {
        "total_records": len(df),
        "total_attrition": int((df["Attrition"] == 1).sum()),
        "total_retained": int((df["Attrition"] == 0).sum()),
        "attrition_rate_pct": round(float((df["Attrition"] == 1).mean() * 100), 2),
        "avg_age": round(float(df["Age"].mean()), 1),
        "avg_income": round(float(df["MonthlyIncome"].mean()), 2),
        "avg_years": round(float(df["YearsAtCompany"].mean()), 1),
        "overtime_attrition_rate": round(float(df[df["OverTime"] == 1]["Attrition"].mean() * 100), 2),
        "no_overtime_attrition_rate": round(float(df[df["OverTime"] == 0]["Attrition"].mean() * 100), 2)
    }
    summary_path = os.path.join(output_dir, "summary.json")
    with open(summary_path, "w") as f:
        json.dump(dataset_summary, f, indent=2)

    print("Pipeline training and serialization complete!")

if __name__ == "__main__":
    train_pipeline()
