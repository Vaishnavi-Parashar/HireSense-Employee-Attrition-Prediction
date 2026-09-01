# HireSense – Employee Attrition Prediction

HireSense is a Machine Learning-based Employee Attrition Prediction System designed to predict whether an employee is likely to leave an organization.

The system combines a trained Machine Learning backend with an interactive web-based frontend to provide employee attrition predictions, risk levels, probability scores, model performance analysis, and explainable insights.


## 🚀 Project Overview

Employee attrition is a major challenge for organizations because losing employees can increase recruitment costs, reduce productivity, and affect team performance.

HireSense uses employee-related information such as:

- Age
- Job Level
- Monthly Income
- Years at Company
- Distance From Home
- Overtime
- Stock Option Level
- Work-Life Balance
- Job Satisfaction

to predict the likelihood of employee attrition.

The application provides:

- Employee attrition prediction
- Attrition probability
- Risk classification
- Model selection
- Model performance comparison
- Feature importance
- Employee analysis
- Retention insights
- Interactive dashboard


# 🧠 Machine Learning

The project uses multiple Machine Learning models for employee attrition prediction.

### Models Included

- Gradient Boosting
- Random Forest
- XGBoost
- K-Nearest Neighbors (KNN)

The system allows users to select a trained model and generate predictions.

### Best Performing Model

The application currently highlights:

**Gradient Boosting**

with an accuracy of approximately **92.98%** on the evaluated dataset.

> Model performance may vary depending on the dataset, preprocessing, and evaluation methodology.


# 📊 Input Features

The prediction system uses the following employee characteristics:

| Feature | Description |
|---|---|
| Age | Employee's age |
| Job Level | Employee job level from 1–5 |
| Monthly Income | Monthly employee income |
| Years At Company | Number of years employee has worked at the company |
| Distance From Home | Distance between home and workplace |
| OverTime | Whether mandatory overtime is required |
| Stock Option Level | Employee stock option level from 0–3 |
| Work Life Balance | Work-life balance rating from 1–4 |
| Job Satisfaction | Job satisfaction rating from 1–4 |

---

# 🎯 Prediction Output

After entering employee information, HireSense provides:

### Prediction

- `Attrition (Yes)`
- `Retained (No)`

### Risk Level

- 🟢 Low Risk
- 🟡 Medium Risk
- 🔴 High Risk

### Probability

The system also provides the predicted probability of employee attrition.

Example:

```text
Prediction: Attrition (Yes)
Probability: 78.45%
Risk Level: High Risk
