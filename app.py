# ============================================================
# HireSense - AI Workforce Intelligence Dashboard
# Streamlit Application
# ============================================================

import os
import warnings

import joblib
import numpy as np
import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

warnings.filterwarnings("ignore")


# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(
    page_title="HireSense | AI Workforce Intelligence",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="expanded"
)


# ============================================================
# FILE CONFIGURATION
# ============================================================

MODEL_PATH = "employee_attrition_model.pkl"
SCALER_PATH = "employee_scaler.pkl"

DATASET_PATHS = [
    "realistic_employee_attrition.csv",
    "employee_attrition.csv",
    "WA_Fn-UseC_-HR-Employee-Attrition.csv"
]

# ------------------------------------------------------------
# LOGO
# ------------------------------------------------------------
# If you have an online logo URL, paste it here.
#
# Example:
# LOGO_URL = "https://your-domain.com/hiresense-logo.png"
#
# If you don't have a URL, keep it empty and put:
# hiresense-logo.png
# beside app.py
# ------------------------------------------------------------

LOGO_URL = ""

LOCAL_LOGOS = [
    "hiresense-logo.png",
    "heartshield-logo.png",
    "logo.png"
]


# ============================================================
# MODEL FEATURES
# ============================================================

FEATURES = [
    "Age",
    "JobLevel",
    "MonthlyIncome",
    "YearsAtCompany",
    "StockOptionLevel",
    "DistanceFromHome",
    "OverTime",
    "WorkLifeBalance",
    "JobSatisfaction"
]

SCALED_FEATURES = [
    "Age",
    "MonthlyIncome",
    "YearsAtCompany",
    "DistanceFromHome"
]


# ============================================================
# GLOBAL CSS
# ============================================================

st.markdown(
    """
    <style>

    /* ========================================================
       GLOBAL
       ======================================================== */

    .stApp {
        background:
            radial-gradient(
                circle at 95% 5%,
                rgba(237, 65, 151, 0.08),
                transparent 25%
            ),
            radial-gradient(
                circle at 5% 90%,
                rgba(106, 45, 210, 0.06),
                transparent 25%
            ),
            #faf9fc;
    }

    .main .block-container {
        max-width: 1500px;
        padding-top: 1.3rem;
        padding-bottom: 2rem;
    }

    /* ========================================================
       SIDEBAR
       ======================================================== */

    section[data-testid="stSidebar"] {
        background:
            linear-gradient(
                180deg,
                #200b55 0%,
                #351078 50%,
                #18073e 100%
            );
    }

    section[data-testid="stSidebar"] > div {
        padding-top: 1rem;
    }

    section[data-testid="stSidebar"] p,
    section[data-testid="stSidebar"] label,
    section[data-testid="stSidebar"] span {
        color: white;
    }

    .sidebar-brand {
        text-align: center;
        font-size: 29px;
        font-weight: 800;
        color: white;
        letter-spacing: -1px;
        margin-top: 5px;
    }

    .sidebar-brand span {
        color: #f04a94;
    }

    .sidebar-tagline {
        text-align: center;
        font-size: 12px;
        color: #ddd4f5 !important;
        margin-top: -3px;
        margin-bottom: 18px;
    }

    .sidebar-description {
        background: rgba(255,255,255,0.09);
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 17px;
        padding: 16px;
        margin-top: 18px;
        color: white;
    }

    /* ========================================================
       RADIO NAVIGATION
       ======================================================== */

    section[data-testid="stSidebar"]
    div[role="radiogroup"] {
        gap: 5px;
    }

    section[data-testid="stSidebar"]
    div[role="radiogroup"] label {
        border-radius: 12px;
        padding: 7px 10px;
        transition: 0.2s ease;
    }

    section[data-testid="stSidebar"]
    div[role="radiogroup"] label:hover {
        background: rgba(255,255,255,0.08);
    }

    /* ========================================================
       TOP BAR
       ======================================================== */

    .topbar {
        border-bottom: 1px solid #eeeaf4;
        padding-bottom: 13px;
        margin-bottom: 20px;
    }

    .topbar-title {
        font-size: 14px;
        font-weight: 700;
        color: #261653;
    }

    .topbar-sub {
        color: #9993a8;
        font-size: 13px;
    }

    /* ========================================================
       HERO
       ======================================================== */

    .hero-box {
        background:
            radial-gradient(
                circle at 90% 40%,
                rgba(211, 65, 167, 0.12),
                transparent 25%
            ),
            linear-gradient(
                115deg,
                #fff6fb,
                #fffafd 55%,
                #f8f3ff
            );
        border: 1px solid #f0dfed;
        border-radius: 25px;
        padding: 38px 42px;
        box-shadow: 0 8px 30px rgba(49, 25, 88, 0.06);
        margin-bottom: 22px;
    }

    .hero-heading {
        font-family: Georgia, serif;
        font-size: 42px;
        font-weight: 700;
        line-height: 1.12;
        color: #121039;
        margin-bottom: 12px;
    }

    .hero-gradient-text {
        background:
            linear-gradient(
                90deg,
                #7029ce,
                #d42a91,
                #ff6546
            );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .hero-description {
        max-width: 680px;
        font-size: 14px;
        line-height: 1.7;
        color: #59556c;
    }

    /* ========================================================
       KPI CARDS
       ======================================================== */

    div[data-testid="stMetric"] {
        background: white;
        border: 1px solid #eeeaf3;
        border-radius: 18px;
        padding: 18px 20px;
        box-shadow: 0 5px 20px rgba(50, 25, 80, 0.045);
    }

    div[data-testid="stMetricLabel"] {
        color: #6b6679 !important;
        font-size: 13px !important;
    }

    div[data-testid="stMetricValue"] {
        color: #19143d !important;
        font-weight: 800 !important;
    }

    div[data-testid="stMetricDelta"] {
        font-size: 11px !important;
    }

    /* ========================================================
       HEADINGS
       ======================================================== */

    h1 {
        color: #1c1741;
        font-weight: 800;
    }

    h2 {
        color: #21194a;
        font-weight: 750;
    }

    h3 {
        color: #2b2054;
        font-weight: 750;
    }

    /* ========================================================
       STREAMLIT CONTAINERS
       ======================================================== */

    div[data-testid="stVerticalBlockBorderWrapper"] {
        background: rgba(255,255,255,0.92);
        border: 1px solid #eeeaf4;
        border-radius: 20px;
        box-shadow: 0 5px 20px rgba(50, 25, 80, 0.035);
    }

    /* ========================================================
       BUTTONS
       ======================================================== */

    .stButton > button {
        border-radius: 12px;
        border: 1px solid #dfc9e8;
        min-height: 43px;
        font-weight: 700;
        color: #64258f;
        background: white;
    }

    .stButton > button:hover {
        border-color: #c438ae;
        color: #9a299d;
    }

    /* ========================================================
       INPUTS
       ======================================================== */

    div[data-baseweb="input"] {
        border-radius: 10px;
    }

    div[data-baseweb="select"] > div {
        border-radius: 10px;
    }

    /* ========================================================
       TABS
       ======================================================== */

    button[data-baseweb="tab"] {
        font-weight: 650;
    }

    /* ========================================================
       FOOTER
       ======================================================== */

    .footer-line {
        text-align: center;
        color: #888395;
        font-size: 12px;
        padding-top: 25px;
        padding-bottom: 5px;
    }

    /* ========================================================
       HIDE STREAMLIT DEFAULT
       ======================================================== */

    #MainMenu {
        visibility: hidden;
    }

    footer {
        visibility: hidden;
    }

    header {
        visibility: hidden;
    }

    </style>
    """,
    unsafe_allow_html=True
)


# ============================================================
# LOAD MODEL
# ============================================================

@st.cache_resource
def load_model():

    if not os.path.exists(MODEL_PATH):
        return None

    try:
        return joblib.load(MODEL_PATH)

    except Exception as error:
        st.error(f"Model loading failed: {error}")
        return None


# ============================================================
# LOAD SCALER
# ============================================================

@st.cache_resource
def load_scaler():

    if not os.path.exists(SCALER_PATH):
        return None

    try:
        return joblib.load(SCALER_PATH)

    except Exception:
        return None


# ============================================================
# LOAD DATASET
# ============================================================

@st.cache_data
def load_dataset():

    for path in DATASET_PATHS:

        if os.path.exists(path):

            try:
                return pd.read_csv(path), path

            except Exception:
                continue

    return None, None


model = load_model()
scaler = load_scaler()
df, active_dataset = load_dataset()


# ============================================================
# DATA CLEANING
# ============================================================

def clean_dataset(data):

    if data is None:
        return None

    data = data.copy()

    data.columns = [
        str(column).strip()
        for column in data.columns
    ]

    # OverTime
    if "OverTime" in data.columns:

        if data["OverTime"].dtype == object:

            data["OverTime"] = (
                data["OverTime"]
                .astype(str)
                .str.strip()
                .str.lower()
                .map({
                    "yes": 1,
                    "no": 0,
                    "1": 1,
                    "0": 0
                })
            )

    # Attrition
    if "Attrition" in data.columns:

        if data["Attrition"].dtype == object:

            data["Attrition"] = (
                data["Attrition"]
                .astype(str)
                .str.strip()
                .str.lower()
                .map({
                    "yes": 1,
                    "no": 0,
                    "1": 1,
                    "0": 0
                })
            )

    return data


df = clean_dataset(df)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def money_format(value):

    try:

        value = float(value)

        if value >= 100000:
            return f"₹{value/100000:.1f}L"

        if value >= 1000:
            return f"₹{value/1000:.1f}K"

        return f"₹{value:.0f}"

    except Exception:
        return str(value)


def performance_risk(row):

    score = 0

    satisfaction = float(
        row.get("JobSatisfaction", 3)
    )

    worklife = float(
        row.get("WorkLifeBalance", 3)
    )

    overtime = float(
        row.get("OverTime", 0)
    )

    years = float(
        row.get("YearsAtCompany", 5)
    )

    if satisfaction <= 2:
        score += 35

    elif satisfaction == 3:
        score += 15

    if worklife <= 2:
        score += 25

    elif worklife == 3:
        score += 10

    if overtime == 1:
        score += 25

    if years <= 1:
        score += 15

    return min(score, 100)


def retention_score(row):

    satisfaction = float(
        row.get("JobSatisfaction", 3)
    )

    worklife = float(
        row.get("WorkLifeBalance", 3)
    )

    overtime = float(
        row.get("OverTime", 0)
    )

    years = float(
        row.get("YearsAtCompany", 5)
    )

    stock = float(
        row.get("StockOptionLevel", 0)
    )

    score = 45

    score += satisfaction * 8
    score += worklife * 5
    score += min(years, 10) * 1.5
    score += stock * 4

    if overtime == 1:
        score -= 12

    return round(
        max(0, min(100, score)),
        1
    )


def is_pipeline(model_object):

    return (
        hasattr(model_object, "named_steps")
        and hasattr(model_object, "predict")
    )


# ============================================================
# MODEL INPUT PREPARATION
# ============================================================

def prepare_model_input(values):

    input_df = pd.DataFrame(
        [values],
        columns=FEATURES
    )

    # If saved object is already a Pipeline,
    # don't apply scaler manually.
    if is_pipeline(model):

        return input_df

    # Apply the separately saved scaler.
    if scaler is not None:

        try:

            input_df[SCALED_FEATURES] = (
                scaler.transform(
                    input_df[SCALED_FEATURES]
                )
            )

        except Exception:

            # Some scalers may expect a different
            # exact feature arrangement.
            pass

    return input_df


# ============================================================
# MODEL PREDICTION
# ============================================================

def predict_employee(values):

    if model is None:
        return None, None, None

    try:

        model_input = prepare_model_input(values)

        prediction = model.predict(
            model_input
        )[0]

        prediction = int(prediction)

        # ----------------------------------------------------
        # Probability model
        # ----------------------------------------------------

        if hasattr(model, "predict_proba"):

            probabilities = model.predict_proba(
                model_input
            )[0]

            classes = list(
                getattr(
                    model,
                    "classes_",
                    [0, 1]
                )
            )

            if 1 in classes:

                positive_index = classes.index(1)

                risk = float(
                    probabilities[positive_index]
                )

            else:

                risk = float(
                    max(probabilities)
                )

        # ----------------------------------------------------
        # LinearSVC / SVM
        # ----------------------------------------------------

        elif hasattr(model, "decision_function"):

            decision = model.decision_function(
                model_input
            )

            decision = float(
                np.asarray(decision).reshape(-1)[0]
            )

            # Convert decision function to 0-1 score.
            risk = 1 / (
                1 + np.exp(-decision)
            )

        # ----------------------------------------------------
        # Fallback
        # ----------------------------------------------------

        else:

            risk = float(prediction)

        risk = max(
            0.0,
            min(1.0, risk)
        )

        return (
            prediction,
            risk,
            model_input
        )

    except Exception as error:

        return (
            None,
            None,
            str(error)
        )


# ============================================================
# LOGO DISPLAY
# ============================================================

def show_logo():

    if LOGO_URL.strip():

        try:

            st.image(
                LOGO_URL,
                width=145
            )

            return

        except Exception:
            pass

    for logo in LOCAL_LOGOS:

        if os.path.exists(logo):

            st.image(
                logo,
                width=145
            )

            return


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:

    show_logo()

    st.markdown(
        """
        <div class="sidebar-brand">
            Hire<span>Sense</span>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.markdown(
        """
        <div class="sidebar-tagline">
            See Potential. Retain Talent.
        </div>
        """,
        unsafe_allow_html=True
    )

    navigation = [
        "Dashboard",
        "Attrition Prediction",
        "Performance Risk",
        "Retention Insights",
        "Employee Analytics",
        "Reports",
        "AI Assistant",
        "Settings",
        "About Us"
    ]

    selected_page = st.radio(
        "Navigation",
        navigation,
        label_visibility="collapsed"
    )

    st.markdown(
        """
        <div class="sidebar-description">

        <b>✨ Smarter Decisions.</b>

        <br><br>

        Stronger Teams.<br>
        Better Tomorrow.

        <br><br>

        AI-powered workforce intelligence
        for modern HR teams.

        </div>
        """,
        unsafe_allow_html=True
    )


# ============================================================
# TOP HEADER
# ============================================================

header_left, header_middle, header_right = st.columns(
    [6, 1.5, 2]
)

with header_left:

    st.markdown(
        f"""
        <div class="topbar">

        <span class="topbar-title">
            HireSense
        </span>

        &nbsp; / &nbsp;

        <span class="topbar-sub">
            {selected_page}
        </span>

        </div>
        """,
        unsafe_allow_html=True
    )


with header_middle:

    st.button(
        "✨ AI Assistant",
        use_container_width=True
    )


with header_right:

    st.markdown(
        """
        <div style="
            text-align:right;
            padding-top:8px;
            color:#32294b;
            font-size:13px;
        ">
            🔔 &nbsp; 👩🏻‍💼 <b>Hi, Admin</b>
            <br>
            <span style="
                color:#9993a8;
                font-size:11px;
            ">
                HR Manager
            </span>
        </div>
        """,
        unsafe_allow_html=True
    )


# ============================================================
# DASHBOARD
# ============================================================

if selected_page == "Dashboard":

    st.markdown(
        """
        <div class="hero-box">

        <div class="hero-heading">

        Understand Your Workforce.<br>

        <span class="hero-gradient-text">
        Retain Your Best Talent.
        </span>

        </div>

        <div class="hero-description">

        Predict employee attrition, identify performance risks
        and get AI-powered retention strategies —
        all in one intelligent platform.

        </div>

        </div>
        """,
        unsafe_allow_html=True
    )

    # --------------------------------------------------------
    # CALCULATE KPI
    # --------------------------------------------------------

    if df is not None:

        dashboard_df = df.copy()

        total_employees = len(
            dashboard_df
        )

        if "Attrition" in dashboard_df.columns:

            attrition_count = int(
                dashboard_df["Attrition"].sum()
            )

        else:

            attrition_count = 0

        attrition_rate = (
            attrition_count /
            total_employees *
            100
            if total_employees
            else 0
        )

        dashboard_df[
            "PerformanceRisk"
        ] = dashboard_df.apply(
            performance_risk,
            axis=1
        )

        dashboard_df[
            "RetentionScore"
        ] = dashboard_df.apply(
            retention_score,
            axis=1
        )

        high_performance_risk = int(
            (
                dashboard_df["PerformanceRisk"]
                >= 60
            ).sum()
        )

        average_retention = float(
            dashboard_df[
                "RetentionScore"
            ].mean()
        )

    else:

        total_employees = 0
        attrition_count = 0
        attrition_rate = 0
        high_performance_risk = 0
        average_retention = 0

    # --------------------------------------------------------
    # KPI ROW
    # --------------------------------------------------------

    k1, k2, k3, k4 = st.columns(4)

    with k1:

        st.metric(
            "👥 Total Employees",
            f"{total_employees:,}",
            "Workforce records"
        )

    with k2:

        st.metric(
            "👤 Predicted Attrition Risk",
            f"{attrition_count:,}",
            f"{attrition_rate:.1f}% historical attrition"
        )

    with k3:

        st.metric(
            "⚠️ High Performance Risk",
            f"{high_performance_risk:,}",
            "AI-derived indicator"
        )

    with k4:

        st.metric(
            "💚 Average Retention Score",
            f"{average_retention:.1f}/100",
            "Workforce indicator"
        )

    st.write("")

    # --------------------------------------------------------
    # CHARTS
    # --------------------------------------------------------

    chart_left, chart_right = st.columns(2)

    with chart_left:

        with st.container(border=True):

            st.subheader(
                "👥 Attrition Overview"
            )

            if (
                df is not None
                and "Attrition" in df.columns
            ):

                stay_count = int(
                    (
                        df["Attrition"] == 0
                    ).sum()
                )

                leave_count = int(
                    (
                        df["Attrition"] == 1
                    ).sum()
                )

                pie = go.Figure(
                    data=[
                        go.Pie(
                            labels=[
                                "Likely to Stay",
                                "Likely to Leave"
                            ],
                            values=[
                                stay_count,
                                leave_count
                            ],
                            hole=0.68,
                            textinfo="none"
                        )
                    ]
                )

                pie.update_layout(
                    height=330,
                    margin=dict(
                        l=0,
                        r=0,
                        t=10,
                        b=0
                    ),
                    showlegend=True,
                    legend=dict(
                        orientation="v"
                    ),
                    annotations=[
                        dict(
                            text=(
                                f"<b>{attrition_rate:.1f}%</b>"
                                "<br>"
                                "<span style='font-size:11px'>"
                                "Attrition"
                                "</span>"
                            ),
                            x=0.5,
                            y=0.5,
                            showarrow=False,
                            font=dict(
                                size=22,
                                color="#241742"
                            )
                        )
                    ]
                )

                st.plotly_chart(
                    pie,
                    use_container_width=True,
                    config={
                        "displayModeBar": False
                    }
                )

            else:

                st.warning(
                    "Dataset not found."
                )

    with chart_right:

        with st.container(border=True):

            st.subheader(
                "📊 Performance Risk Distribution"
            )

            if df is not None:

                low = int(
                    (
                        dashboard_df[
                            "PerformanceRisk"
                        ] < 30
                    ).sum()
                )

                medium = int(
                    (
                        (
                            dashboard_df[
                                "PerformanceRisk"
                            ] >= 30
                        )
                        &
                        (
                            dashboard_df[
                                "PerformanceRisk"
                            ] < 60
                        )
                    ).sum()
                )

                high = int(
                    (
                        dashboard_df[
                            "PerformanceRisk"
                        ] >= 60
                    ).sum()
                )

                risk_distribution = pd.DataFrame(
                    {
                        "Risk Level": [
                            "Low Risk",
                            "Medium Risk",
                            "High Risk"
                        ],
                        "Employees": [
                            low,
                            medium,
                            high
                        ]
                    }
                )

                bar = px.bar(
                    risk_distribution,
                    x="Risk Level",
                    y="Employees",
                    text="Employees"
                )

                bar.update_traces(
                    textposition="outside"
                )

                bar.update_layout(
                    height=330,
                    margin=dict(
                        l=10,
                        r=10,
                        t=15,
                        b=10
                    ),
                    plot_bgcolor="rgba(0,0,0,0)",
                    paper_bgcolor="rgba(0,0,0,0)",
                    showlegend=False
                )

                st.plotly_chart(
                    bar,
                    use_container_width=True,
                    config={
                        "displayModeBar": False
                    }
                )

    st.write("")

    # --------------------------------------------------------
    # INSIGHTS
    # --------------------------------------------------------

    insight_left, insight_right = st.columns(2)

    with insight_left:

        with st.container(border=True):

            st.subheader(
                "✨ HireSense AI Insights"
            )

            if df is not None:

                low_satisfaction = int(
                    (
                        df[
                            "JobSatisfaction"
                        ] <= 2
                    ).sum()
                )

                overtime_employees = int(
                    (
                        df[
                            "OverTime"
                        ] == 1
                    ).sum()
                )

                st.write(
                    f"""
                    **{low_satisfaction:,} employees** have
                    low job satisfaction indicators.

                    **{overtime_employees:,} employees** are marked
                    as working overtime.

                    HR should prioritize employee recognition,
                    workload balancing, career development and
                    targeted engagement for higher-risk groups.
                    """
                )

            else:

                st.info(
                    "Add the dataset to generate insights."
                )

    with insight_right:

        with st.container(border=True):

            st.subheader(
                "🧠 Workforce Intelligence"
            )

            st.write(
                """
                HireSense combines employee workforce factors
                with machine-learning attrition prediction.

                Use **Attrition Prediction** for individual
                employee assessment.

                Use **Retention Insights** for organization-level
                workforce analysis.

                Use **Employee Analytics** to search and filter
                employee records.
                """
            )

    st.write("")

    # --------------------------------------------------------
    # EMPLOYEE PREVIEW
    # --------------------------------------------------------

    st.subheader(
        "👥 Employee Analytics"
    )

    if df is not None:

        preview = df.copy()

        preview.insert(
            0,
            "Employee ID",
            [
                f"EMP-{index:04d}"
                for index in range(
                    1,
                    len(preview) + 1
                )
            ]
        )

        if "Attrition" in preview.columns:

            preview["Risk Level"] = (
                preview["Attrition"]
                .map({
                    0: "Low Risk",
                    1: "High Risk"
                })
            )

        preview_columns = [
            "Employee ID",
            "Age",
            "JobLevel",
            "MonthlyIncome",
            "YearsAtCompany",
            "JobSatisfaction",
            "OverTime",
            "Risk Level"
        ]

        preview_columns = [
            column
            for column in preview_columns
            if column in preview.columns
        ]

        st.dataframe(
            preview[
                preview_columns
            ].head(10),
            use_container_width=True,
            hide_index=True
        )


# ============================================================
# ATTRITION PREDICTION
# ============================================================

elif selected_page == "Attrition Prediction":

    st.title(
        "🎯 Attrition Prediction"
    )

    st.caption(
        "Analyze an employee using the trained attrition model."
    )

    if model is None:

        st.error(
            "employee_attrition_model.pkl was not found."
        )

        st.code(
            "Put employee_attrition_model.pkl beside app.py"
        )

    else:

        with st.container(border=True):

            st.subheader(
                "Employee Information"
            )

            left, right = st.columns(2)

            with left:

                age = st.number_input(
                    "Age",
                    min_value=18,
                    max_value=70,
                    value=32
                )

                job_level = st.selectbox(
                    "Job Level",
                    [1, 2, 3, 4, 5],
                    index=1
                )

                monthly_income = st.number_input(
                    "Monthly Income",
                    min_value=1000,
                    max_value=200000,
                    value=5000,
                    step=500
                )

                years_company = st.number_input(
                    "Years At Company",
                    min_value=0,
                    max_value=50,
                    value=5
                )

                stock_option = st.selectbox(
                    "Stock Option Level",
                    [0, 1, 2, 3],
                    index=0
                )

            with right:

                distance = st.number_input(
                    "Distance From Home",
                    min_value=1,
                    max_value=100,
                    value=5
                )

                overtime = st.selectbox(
                    "OverTime",
                    ["No", "Yes"]
                )

                worklife = st.select_slider(
                    "Work Life Balance",
                    options=[1, 2, 3, 4],
                    value=3
                )

                satisfaction = st.select_slider(
                    "Job Satisfaction",
                    options=[1, 2, 3, 4],
                    value=3
                )

        st.write("")

        analyze = st.button(
            "🔮 Analyze Employee",
            use_container_width=True
        )

        if analyze:

            employee_values = {

                "Age": age,

                "JobLevel": job_level,

                "MonthlyIncome": monthly_income,

                "YearsAtCompany": years_company,

                "StockOptionLevel": stock_option,

                "DistanceFromHome": distance,

                "OverTime": (
                    1
                    if overtime == "Yes"
                    else 0
                ),

                "WorkLifeBalance": worklife,

                "JobSatisfaction": satisfaction
            }

            prediction, risk, result = predict_employee(
                employee_values
            )

            if prediction is None:

                st.error(
                    f"Prediction failed: {result}"
                )

            else:

                risk_percentage = risk * 100

                if risk >= 0.67:

                    risk_level = "HIGH ATTRITION RISK"
                    risk_message = (
                        "Immediate retention intervention recommended."
                    )

                elif risk >= 0.34:

                    risk_level = "MEDIUM ATTRITION RISK"
                    risk_message = (
                        "Monitor employee engagement and workload."
                    )

                else:

                    risk_level = "LOW ATTRITION RISK"
                    risk_message = (
                        "Employee currently shows relatively stable indicators."
                    )

                st.write("")

                result_left, result_right = st.columns(
                    [1.3, 1]
                )

                with result_left:

                    with st.container(border=True):

                        st.markdown(
                            f"""
                            <div style="
                                text-align:center;
                                padding:25px;
                            ">

                            <div style="
                                font-size:48px;
                                font-weight:850;
                                color:#211743;
                            ">
                            {risk_percentage:.1f}%
                            </div>

                            <div style="
                                font-size:20px;
                                font-weight:800;
                                color:#9b277f;
                            ">
                            {risk_level}
                            </div>

                            <div style="
                                margin-top:12px;
                                color:#6d687b;
                            ">
                            {risk_message}
                            </div>

                            </div>
                            """,
                            unsafe_allow_html=True
                        )

                with result_right:

                    with st.container(border=True):

                        st.subheader(
                            "Employee Indicators"
                        )

                        st.metric(
                            "Job Satisfaction",
                            f"{satisfaction}/4"
                        )

                        st.metric(
                            "Work-Life Balance",
                            f"{worklife}/4"
                        )

                        st.metric(
                            "Overtime",
                            overtime
                        )

                st.write("")

                # ------------------------------------------------
                # RECOMMENDATION
                # ------------------------------------------------

                st.subheader(
                    "💡 Recommended HR Action"
                )

                recommendations = []

                if satisfaction <= 2:

                    recommendations.append(
                        "Conduct a job-satisfaction and engagement discussion."
                    )

                if worklife <= 2:

                    recommendations.append(
                        "Review workload and work-life balance."
                    )

                if overtime == "Yes":

                    recommendations.append(
                        "Evaluate overtime frequency and workload distribution."
                    )

                if years_company <= 1:

                    recommendations.append(
                        "Provide stronger onboarding and career guidance."
                    )

                if stock_option == 0:

                    recommendations.append(
                        "Consider reviewing long-term employee incentive options."
                    )

                if not recommendations:

                    recommendations.append(
                        "Continue regular engagement and career-development check-ins."
                    )

                for recommendation in recommendations:

                    st.info(
                        f"• {recommendation}"
                    )

                if not hasattr(
                    model,
                    "predict_proba"
                ):

                    st.caption(
                        "Note: The current model does not expose "
                        "predict_proba(). The displayed percentage "
                        "is a normalized model risk score, not a "
                        "calibrated real-world probability."
                    )


# ============================================================
# PERFORMANCE RISK
# ============================================================

elif selected_page == "Performance Risk":

    st.title(
        "⚠️ Performance Risk"
    )

    st.caption(
        "AI-derived workforce risk indicator based on available employee factors."
    )

    if df is None:

        st.warning(
            "Employee dataset not found."
        )

    else:

        performance_df = df.copy()

        performance_df[
            "Performance Risk Score"
        ] = performance_df.apply(
            performance_risk,
            axis=1
        )

        performance_df[
            "Risk Level"
        ] = pd.cut(
            performance_df[
                "Performance Risk Score"
            ],
            bins=[
                -1,
                29,
                59,
                100
            ],
            labels=[
                "Low Risk",
                "Medium Risk",
                "High Risk"
            ]
        )

        low_count = int(
            (
                performance_df[
                    "Risk Level"
                ] == "Low Risk"
            ).sum()
        )

        medium_count = int(
            (
                performance_df[
                    "Risk Level"
                ] == "Medium Risk"
            ).sum()
        )

        high_count = int(
            (
                performance_df[
                    "Risk Level"
                ] == "High Risk"
            ).sum()
        )

        p1, p2, p3 = st.columns(3)

        with p1:
            st.metric(
                "🟢 Low Risk",
                f"{low_count:,}"
            )

        with p2:
            st.metric(
                "🟠 Medium Risk",
                f"{medium_count:,}"
            )

        with p3:
            st.metric(
                "🔴 High Risk",
                f"{high_count:,}"
            )

        st.write("")

        with st.container(border=True):

            st.subheader(
                "Performance Risk Distribution"
            )

            histogram = px.histogram(
                performance_df,
                x="Performance Risk Score",
                nbins=20
            )

            histogram.update_layout(
                plot_bgcolor="rgba(0,0,0,0)",
                paper_bgcolor="rgba(0,0,0,0)"
            )

            st.plotly_chart(
                histogram,
                use_container_width=True
            )

        st.write("")

        columns = [
            "Age",
            "JobLevel",
            "JobSatisfaction",
            "WorkLifeBalance",
            "OverTime",
            "Performance Risk Score",
            "Risk Level"
        ]

        columns = [
            column
            for column in columns
            if column in performance_df.columns
        ]

        st.dataframe(
            performance_df[
                columns
            ].head(100),
            use_container_width=True,
            hide_index=True
        )

        st.info(
            "Performance Risk is a derived workforce indicator. "
            "The supplied attrition training model is not a separately "
            "trained performance prediction model."
        )


# ============================================================
# RETENTION INSIGHTS
# ============================================================

elif selected_page == "Retention Insights":

    st.title(
        "💡 Retention Insights"
    )

    st.caption(
        "Understand the workforce factors influencing employee retention."
    )

    if df is None:

        st.warning(
            "Employee dataset not found."
        )

    else:

        retention_df = df.copy()

        retention_df[
            "Retention Score"
        ] = retention_df.apply(
            retention_score,
            axis=1
        )

        average_score = float(
            retention_df[
                "Retention Score"
            ].mean()
        )

        low_satisfaction = int(
            (
                retention_df[
                    "JobSatisfaction"
                ] <= 2
            ).sum()
        )

        overtime_count = int(
            (
                retention_df[
                    "OverTime"
                ] == 1
            ).sum()
        )

        low_worklife = int(
            (
                retention_df[
                    "WorkLifeBalance"
                ] <= 2
            ).sum()
        )

        left, right = st.columns(2)

        with left:

            with st.container(border=True):

                st.subheader(
                    "Average Retention Score"
                )

                gauge = go.Figure(
                    go.Indicator(
                        mode="gauge+number",
                        value=average_score,
                        number={
                            "suffix": "/100"
                        },
                        gauge={
                            "axis": {
                                "range": [
                                    0,
                                    100
                                ]
                            },
                            "bar": {
                                "color": "#7c2cc8"
                            },
                            "steps": [
                                {
                                    "range": [
                                        0,
                                        40
                                    ],
                                    "color": "#fdecef"
                                },
                                {
                                    "range": [
                                        40,
                                        70
                                    ],
                                    "color": "#fff5df"
                                },
                                {
                                    "range": [
                                        70,
                                        100
                                    ],
                                    "color": "#eef8ed"
                                }
                            ]
                        }
                    )
                )

                gauge.update_layout(
                    height=350,
                    margin=dict(
                        l=20,
                        r=20,
                        t=25,
                        b=10
                    )
                )

                st.plotly_chart(
                    gauge,
                    use_container_width=True
                )

        with right:

            with st.container(border=True):

                st.subheader(
                    "Job Satisfaction Distribution"
                )

                satisfaction_data = (
                    retention_df[
                        "JobSatisfaction"
                    ]
                    .value_counts()
                    .sort_index()
                    .reset_index()
                )

                satisfaction_data.columns = [
                    "Job Satisfaction",
                    "Employees"
                ]

                satisfaction_chart = px.bar(
                    satisfaction_data,
                    x="Job Satisfaction",
                    y="Employees",
                    text="Employees"
                )

                satisfaction_chart.update_traces(
                    textposition="outside"
                )

                satisfaction_chart.update_layout(
                    plot_bgcolor="rgba(0,0,0,0)",
                    paper_bgcolor="rgba(0,0,0,0)"
                )

                st.plotly_chart(
                    satisfaction_chart,
                    use_container_width=True
                )

        st.write("")

        st.subheader(
            "Key Retention Signals"
        )

        r1, r2, r3 = st.columns(3)

        with r1:
            st.metric(
                "Low Satisfaction",
                f"{low_satisfaction:,}"
            )

        with r2:
            st.metric(
                "Overtime Employees",
                f"{overtime_count:,}"
            )

        with r3:
            st.metric(
                "Low Work-Life Balance",
                f"{low_worklife:,}"
            )

        st.write("")

        with st.container(border=True):

            st.subheader(
                "✨ Recommended Retention Actions"
            )

            st.write(
                """
                **1. Employee Recognition**

                Improve recognition and appreciation for employees
                showing low satisfaction indicators.

                **2. Workload Balancing**

                Review overtime-heavy employee groups and identify
                workload distribution issues.

                **3. Career Development**

                Create structured growth paths and development
                opportunities.

                **4. HR Check-ins**

                Conduct targeted engagement discussions with
                employees showing multiple risk indicators.
                """
            )


# ============================================================
# EMPLOYEE ANALYTICS
# ============================================================

elif selected_page == "Employee Analytics":

    st.title(
        "👥 Employee Analytics"
    )

    st.caption(
        "Search, filter and explore employee-level workforce data."
    )

    if df is None:

        st.warning(
            "Employee dataset not found."
        )

    else:

        analytics_df = df.copy()

        analytics_df.insert(
            0,
            "Employee ID",
            [
                f"EMP-{index:04d}"
                for index in range(
                    1,
                    len(analytics_df) + 1
                )
            ]
        )

        analytics_df[
            "Risk Level"
        ] = np.where(
            analytics_df[
                "Attrition"
            ] == 1,
            "High Risk",
            "Low Risk"
        )

        f1, f2 = st.columns(
            [2, 1]
        )

        with f1:

            search = st.text_input(
                "🔍 Search Employee",
                placeholder="Example: EMP-0025"
            )

        with f2:

            risk_filter = st.multiselect(
                "Risk Level",
                [
                    "Low Risk",
                    "High Risk"
                ],
                default=[
                    "Low Risk",
                    "High Risk"
                ]
            )

        filtered_df = analytics_df[
            analytics_df[
                "Risk Level"
            ].isin(risk_filter)
        ]

        if search:

            filtered_df = filtered_df[
                filtered_df[
                    "Employee ID"
                ]
                .str.contains(
                    search,
                    case=False,
                    na=False
                )
            ]

        st.write(
            f"Showing **{len(filtered_df):,}** employees"
        )

        columns = [
            "Employee ID",
            "Age",
            "JobLevel",
            "MonthlyIncome",
            "YearsAtCompany",
            "StockOptionLevel",
            "DistanceFromHome",
            "OverTime",
            "WorkLifeBalance",
            "JobSatisfaction",
            "Risk Level"
        ]

        columns = [
            column
            for column in columns
            if column in filtered_df.columns
        ]

        st.dataframe(
            filtered_df[
                columns
            ],
            use_container_width=True,
            hide_index=True,
            height=560
        )


# ============================================================
# REPORTS
# ============================================================

elif selected_page == "Reports":

    st.title(
        "📄 Reports"
    )

    st.caption(
        "Generate and download a workforce analytics report."
    )

    if df is None:

        st.warning(
            "Employee dataset not found."
        )

    else:

        report_df = df.copy()

        report_df.insert(
            0,
            "Employee ID",
            [
                f"EMP-{index:04d}"
                for index in range(
                    1,
                    len(report_df) + 1
                )
            ]
        )

        report_df[
            "Performance Risk Score"
        ] = report_df.apply(
            performance_risk,
            axis=1
        )

        report_df[
            "Retention Score"
        ] = report_df.apply(
            retention_score,
            axis=1
        )

        report_df[
            "Risk Level"
        ] = np.where(
            report_df[
                "Attrition"
            ] == 1,
            "High Risk",
            "Low Risk"
        )

        total = len(
            report_df
        )

        attrition = int(
            report_df[
                "Attrition"
            ].sum()
        )

        attrition_percentage = (
            attrition / total * 100
            if total
            else 0
        )

        high_risk = int(
            (
                report_df[
                    "Risk Level"
                ] == "High Risk"
            ).sum()
        )

        a, b, c = st.columns(3)

        with a:
            st.metric(
                "Total Employees",
                f"{total:,}"
            )

        with b:
            st.metric(
                "Attrition Rate",
                f"{attrition_percentage:.1f}%"
            )

        with c:
            st.metric(
                "High Risk Employees",
                f"{high_risk:,}"
            )

        st.write("")

        with st.container(border=True):

            st.subheader(
                "Workforce Report Preview"
            )

            st.dataframe(
                report_df.head(100),
                use_container_width=True,
                hide_index=True
            )

        csv_data = report_df.to_csv(
            index=False
        ).encode(
            "utf-8"
        )

        st.write("")

        st.download_button(
            "⬇️ Download Workforce CSV",
            data=csv_data,
            file_name="hiresense_workforce_report.csv",
            mime="text/csv",
            use_container_width=True
        )


# ============================================================
# AI ASSISTANT
# ============================================================

elif selected_page == "AI Assistant":

    st.title(
        "✨ HireSense AI Assistant"
    )

    st.caption(
        "Ask questions about the available workforce data."
    )

    if df is None:

        st.info(
            "Add the employee dataset to activate workforce insights."
        )

    else:

        total = len(df)

        attrition_count = int(
            df[
                "Attrition"
            ].sum()
        )

        attrition_percentage = (
            attrition_count /
            total *
            100
            if total
            else 0
        )

        low_satisfaction = int(
            (
                df[
                    "JobSatisfaction"
                ] <= 2
            ).sum()
        )

        overtime_count = int(
            (
                df[
                    "OverTime"
                ] == 1
            ).sum()
        )

        with st.container(border=True):

            st.subheader(
                "🤖 Current Workforce Summary"
            )

            st.write(
                f"""
                Your workforce contains **{total:,} employee records**.

                Historical attrition is
                **{attrition_percentage:.1f}%**.

                **{low_satisfaction:,} employees**
                have low job satisfaction indicators.

                **{overtime_count:,} employees**
                are marked as working overtime.

                The main HR focus areas should be employee engagement,
                workload balancing, career development and retention
                interventions.
                """
            )

        st.write("")

        question = st.text_input(
            "Ask HireSense",
            placeholder=(
                "Example: What should HR focus on?"
            )
        )

        if question:

            question_lower = (
                question.lower()
            )

            if (
                "attrition" in question_lower
                or "leave" in question_lower
            ):

                answer = (
                    f"There are {attrition_count:,} attrition "
                    f"records out of {total:,} employees, "
                    f"which represents "
                    f"{attrition_percentage:.1f}%."
                )

            elif (
                "satisfaction"
                in question_lower
            ):

                answer = (
                    f"{low_satisfaction:,} employees have "
                    f"job satisfaction of 1 or 2. "
                    f"These employees deserve targeted "
                    f"engagement and HR follow-up."
                )

            elif (
                "overtime"
                in question_lower
            ):

                answer = (
                    f"{overtime_count:,} employees are marked "
                    f"as working overtime. Workload balancing "
                    f"could be an important retention action."
                )

            elif (
                "retention"
                in question_lower
            ):

                answer = (
                    "Focus on job satisfaction, work-life balance, "
                    "overtime exposure, recognition and career development."
                )

            else:

                answer = (
                    "Based on the available workforce data, "
                    "HR should prioritize employee satisfaction, "
                    "work-life balance, overtime exposure and "
                    "career development."
                )

            st.success(
                answer
            )


# ============================================================
# SETTINGS
# ============================================================

elif selected_page == "Settings":

    st.title(
        "⚙️ Settings"
    )

    st.subheader(
        "Application Settings"
    )

    st.toggle(
        "Enable AI Insights",
        value=True
    )

    st.toggle(
        "Show Advanced Analytics",
        value=True
    )

    st.write("")

    st.subheader(
        "Model Status"
    )

    if model is not None:

        st.success(
            "✓ Attrition model loaded successfully."
        )

        st.write(
            f"Model type: **{type(model).__name__}**"
        )

    else:

        st.error(
            "✕ employee_attrition_model.pkl not found."
        )

    if scaler is not None:

        st.success(
            "✓ Feature scaler loaded successfully."
        )

    else:

        st.warning(
            "⚠ Separate scaler not found."
        )

    st.subheader(
        "Dataset Status"
    )

    if active_dataset:

        st.success(
            f"✓ Dataset loaded: {active_dataset}"
        )

        st.write(
            f"Records: **{len(df):,}**"
        )

    else:

        st.error(
            "✕ Employee dataset not found."
        )


# ============================================================
# ABOUT US
# ============================================================

elif selected_page == "About Us":

    st.title(
        "💜 About HireSense"
    )

    with st.container(border=True):

        st.markdown(
            """
            ## HireSense

            ### See Potential. Retain Talent.

            HireSense is an AI-powered workforce intelligence
            platform designed to help HR teams understand
            employee attrition patterns and make data-driven
            retention decisions.

            ### Core Capabilities

            - 🎯 Employee Attrition Prediction
            - ⚠️ Workforce Risk Indicators
            - 💡 Retention Insights
            - 👥 Employee Analytics
            - 📊 Workforce Reports
            - ✨ AI-powered Workforce Insights

            ### Employee Factors

            The prediction interface uses:

            - Age
            - Job Level
            - Monthly Income
            - Years At Company
            - Stock Option Level
            - Distance From Home
            - OverTime
            - Work-Life Balance
            - Job Satisfaction

            ### Important Model Note

            The supplied ML model is an employee attrition model.

            Performance Risk and Retention Score shown in this
            dashboard are derived workforce indicators and are
            not presented as separately trained ML models.
            """
        )


# ============================================================
# FOOTER
# ============================================================

st.markdown(
    """
    <div class="footer-line">

    Data-Driven Decisions.
    AI-Powered Insights.
    <b style="color:#c52fa1;">
    People-First Culture.
    </b>

    <br><br>

    © 2026 HireSense. All rights reserved.

    </div>
    """,
    unsafe_allow_html=True
)