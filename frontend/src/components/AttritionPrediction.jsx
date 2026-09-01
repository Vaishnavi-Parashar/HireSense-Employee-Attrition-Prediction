import React, { useState, useEffect } from 'react';
import { BrainCircuit, Play, Cpu, BarChart2, HelpCircle, RefreshCw, Zap, Bot } from 'lucide-react';

export default function AttritionPrediction({ onOpenAiAssistant }) {
  const [selectedModel, setSelectedModel] = useState('Gradient Boosting');
  const [formData, setFormData] = useState({
    Age: 24,
    JobLevel: 1,
    MonthlyIncome: 2500,
    YearsAtCompany: 1,
    StockOptionLevel: 0,
    DistanceFromHome: 25,
    OverTime: 'Yes',
    WorkLifeBalance: 1,
    JobSatisfaction: 1
  });

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setMetrics(data))
      .catch(err => console.error('Failed to load metrics:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'OverTime' ? value : Number(value)
    }));
  };

  const loadTestEmployee = () => {
    setFormData({
      Age: 24,
      JobLevel: 1,
      MonthlyIncome: 2500,
      YearsAtCompany: 1,
      StockOptionLevel: 0,
      DistanceFromHome: 25,
      OverTime: 'Yes',
      WorkLifeBalance: 1,
      JobSatisfaction: 1
    });
    setPredictionResult(null);
    setErrorMsg(null);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setPredictionResult(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model_name: selectedModel,
          features: formData
        })
      });

      const responseText = await response.text();

      if (!responseText || !responseText.trim()) {
        throw new Error(`Server returned empty response (HTTP Status ${response.status})`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error(`Server response is not valid JSON (HTTP ${response.status}): ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Prediction request failed with server status code ${response.status}`);
      }

      setPredictionResult(data);
    } catch (err) {
      console.error("Prediction Error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAiAboutPrediction = () => {
    if (!predictionResult) return;
    const contextObj = {
      employee: {
        age: formData.Age,
        jobLevel: formData.JobLevel,
        monthlyIncome: formData.MonthlyIncome,
        yearsAtCompany: formData.YearsAtCompany,
        distanceFromHome: formData.DistanceFromHome,
        overtime: formData.OverTime,
        stockOptionLevel: formData.StockOptionLevel,
        workLifeBalance: formData.WorkLifeBalance,
        jobSatisfaction: formData.JobSatisfaction
      },
      prediction: {
        label: predictionResult.prediction_text || (predictionResult.prediction === 1 ? 'Attrition (Yes)' : 'Retained (No)'),
        probability: predictionResult.probability,
        risk: predictionResult.risk || predictionResult.risk_level,
        model_used: selectedModel
      }
    };
    if (onOpenAiAssistant) {
      onOpenAiAssistant(contextObj);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="card-hs" style={{ background: 'var(--gradient-card)', borderLeft: '4px solid var(--violet)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--gradient-btn)', color: '#fff' }}>
              <BrainCircuit size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-deep-purple)' }}>
                Employee Attrition Risk Predictor
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Input employee parameters to evaluate real-time attrition risk using your trained ML pipeline.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={loadTestEmployee}
            style={{ fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
          >
            <Zap size={14} style={{ color: 'var(--violet)' }} />
            <span>Load High-Risk Test Profile</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Input Form Column */}
        <div className="card-hs">
          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Model Selection Dropdown */}
            <div style={{ background: '#F5F3FF', padding: '1rem', borderRadius: '0.75rem', border: '1.5px solid #DDD6FE' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '0.5rem' }}>
                <Cpu size={18} style={{ color: 'var(--violet)' }} />
                <span>Select Machine Learning Model</span>
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--violet)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: 'var(--primary-deep-purple)',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="Gradient Boosting">Gradient Boosting (Best Model - Acc 92.98%)</option>
                <option value="XGBoost">XGBoost (Acc 92.72%)</option>
                <option value="KNN">KNN Classifier (Acc 92.59%)</option>
                <option value="Random Forest">Random Forest (Acc 92.18%)</option>
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                Executes the corresponding trained model binary from backend models.
              </span>
            </div>

            {/* Feature Inputs */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-deep-purple)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Employee Profile Characteristics
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Age */}
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  Age (Years)
                </label>
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  min="18"
                  max="65"
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                />
              </div>

              {/* Job Level */}
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  Job Level (1 - 5)
                </label>
                <select
                  name="JobLevel"
                  value={formData.JobLevel}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                >
                  <option value={1}>1 (Entry Level)</option>
                  <option value={2}>2 (Associate)</option>
                  <option value={3}>3 (Mid Level)</option>
                  <option value={4}>4 (Senior / Lead)</option>
                  <option value={5}>5 (Executive)</option>
                </select>
              </div>

              {/* Monthly Income */}
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  Monthly Income ($)
                </label>
                <input
                  type="number"
                  name="MonthlyIncome"
                  value={formData.MonthlyIncome}
                  onChange={handleChange}
                  step="100"
                  min="1000"
                  max="30000"
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                />
              </div>

              {/* Years At Company */}
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  Years At Company
                </label>
                <input
                  type="number"
                  name="YearsAtCompany"
                  value={formData.YearsAtCompany}
                  onChange={handleChange}
                  min="0"
                  max="40"
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                />
              </div>

              {/* Distance From Home */}
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  Distance From Home (Miles)
                </label>
                <input
                  type="number"
                  name="DistanceFromHome"
                  value={formData.DistanceFromHome}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                />
              </div>

              {/* OverTime */}
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  OverTime Requirements
                </label>
                <select
                  name="OverTime"
                  value={formData.OverTime}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                >
                  <option value="Yes">Yes (Mandatory OverTime)</option>
                  <option value="No">No (Standard Hours)</option>
                </select>
              </div>

              {/* Stock Option Level */}
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  Stock Option Level (0 - 3)
                </label>
                <select
                  name="StockOptionLevel"
                  value={formData.StockOptionLevel}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                >
                  <option value={0}>0 (None)</option>
                  <option value={1}>1 (Low Grant)</option>
                  <option value={2}>2 (Medium Grant)</option>
                  <option value={3}>3 (High Grant)</option>
                </select>
              </div>

              {/* Work Life Balance */}
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  Work Life Balance (1 - 4)
                </label>
                <select
                  name="WorkLifeBalance"
                  value={formData.WorkLifeBalance}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                >
                  <option value={1}>1 (Poor)</option>
                  <option value={2}>2 (Fair)</option>
                  <option value={3}>3 (Good)</option>
                  <option value={4}>4 (Excellent)</option>
                </select>
              </div>
            </div>

            {/* Job Satisfaction rating */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                Job Satisfaction Rating (1 = Low, 4 = High)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, JobSatisfaction: num }))}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: formData.JobSatisfaction === num ? '2px solid var(--violet)' : '1px solid var(--border-color)',
                      backgroundColor: formData.JobSatisfaction === num ? '#F5F3FF' : '#FFF',
                      fontWeight: formData.JobSatisfaction === num ? 700 : 400,
                      color: formData.JobSatisfaction === num ? 'var(--violet)' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    Level {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '1rem',
                marginTop: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Processing Preprocessing Pipeline &amp; Model...</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span>PREDICT ATTRITION</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div style={{ marginTop: '1rem', padding: '0.85rem', borderRadius: '0.5rem', background: '#FFE4E6', color: '#E11D48', fontSize: '0.875rem', border: '1px solid #FECDD3' }}>
              <strong>⚠️ API Error:</strong> {errorMsg}
            </div>
          )}
        </div>

        {/* Prediction Results & XAI Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Prediction Result Display Card */}
          <div className="card-hs" style={{
            background: predictionResult ? (predictionResult.prediction === 1 ? 'linear-gradient(135deg, #FFF5F5 0%, #FFE4E6 100%)' : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)') : '#FFFFFF',
            border: predictionResult ? (predictionResult.prediction === 1 ? '2px solid #FECDD3' : '2px solid #BBF7D0') : '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={20} style={{ color: 'var(--violet)' }} />
              <span>Model Prediction Analysis</span>
            </h3>

            {predictionResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>MODEL USED</span>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--violet)', background: '#F5F3FF', padding: '0.25rem 0.75rem', borderRadius: '0.375rem' }}>
                    {predictionResult.model_used}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                    ATTRITION RISK STATUS
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={predictionResult.risk === 'High' || predictionResult.risk_level === 'High Risk' ? 'badge-risk-high' : predictionResult.risk === 'Medium' || predictionResult.risk_level === 'Medium Risk' ? 'badge-risk-medium' : 'badge-risk-low'} style={{ fontSize: '1.125rem', padding: '0.4rem 1rem' }}>
                      {predictionResult.risk} Risk ({predictionResult.risk_level || (predictionResult.risk + ' Risk')})
                    </span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-deep-purple)' }}>
                      Prediction: {predictionResult.prediction} ({predictionResult.prediction === 1 ? 'Attrition' : 'Retained'})
                    </span>
                  </div>
                </div>

                {predictionResult.probability !== undefined && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      <span>Risk Probability Score</span>
                      <span style={{ color: predictionResult.probability > 0.5 ? 'var(--coral)' : '#059669' }}>
                        {predictionResult.probability} ({(predictionResult.probability * 100).toFixed(2)}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(predictionResult.probability * 100, 100)}%`,
                        height: '100%',
                        background: predictionResult.probability > 0.5 ? 'var(--gradient-coral)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        borderRadius: '5px'
                      }} />
                    </div>
                  </div>
                )}

                {/* ASK AI ASSISTANT BUTTON */}
                <button
                  type="button"
                  onClick={handleAskAiAboutPrediction}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1.5px solid var(--violet)',
                    backgroundColor: '#F5F3FF',
                    color: 'var(--violet)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Bot size={18} />
                  <span>Ask AI Assistant about this Prediction</span>
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <BrainCircuit size={48} style={{ color: '#C4B5FD', marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.9375rem', fontWeight: 600 }}>No prediction generated yet.</p>
                <p style={{ fontSize: '0.8125rem' }}>Select a model, enter employee details, and click "Predict Attrition".</p>
              </div>
            )}
          </div>

          {/* XAI / Explainability Breakdown */}
          {predictionResult && predictionResult.xai_factors && predictionResult.xai_factors.length > 0 && (
            <div className="card-hs">
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={18} style={{ color: 'var(--magenta)' }} />
                <span>Why This Prediction? (Key Influential Factors)</span>
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Feature importance analysis derived from the trained model's tree splits for this input.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {predictionResult.xai_factors.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: '#F9FAFB', border: '1px solid var(--border-light)' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-deep-purple)' }}>
                        {item.feature}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        User Value: <strong style={{ color: 'var(--violet)' }}>{item.user_value}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--violet)' }}>
                        {item.importance_pct}%
                      </span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Importance</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model Performance Comparison Section */}
      <div className="card-hs">
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1rem' }}>
          Trained Models Performance Comparison (Ground Truth Metrics)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Model</th>
                <th style={{ padding: '0.75rem' }}>Accuracy</th>
                <th style={{ padding: '0.75rem' }}>Precision</th>
                <th style={{ padding: '0.75rem' }}>Recall</th>
                <th style={{ padding: '0.75rem' }}>F1 Score</th>
                <th style={{ padding: '0.75rem' }}>ROC-AUC</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics && Object.values(metrics).map((m) => (
                <tr key={m.name} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: m.name === selectedModel ? '#F5F3FF' : 'transparent' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-deep-purple)' }}>
                    {m.name} {m.is_best && <span style={{ fontSize: '0.7rem', background: '#D1FAE5', color: '#059669', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', marginLeft: '0.5rem' }}>BEST</span>}
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{(m.accuracy * 100).toFixed(2)}%</td>
                  <td style={{ padding: '0.75rem' }}>{(m.precision * 100).toFixed(2)}%</td>
                  <td style={{ padding: '0.75rem' }}>{(m.recall * 100).toFixed(2)}%</td>
                  <td style={{ padding: '0.75rem' }}>{(m.f1 * 100).toFixed(2)}%</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--violet)' }}>{m.auc.toFixed(4)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {m.name === selectedModel ? (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--violet)', background: '#DDD6FE', padding: '0.2rem 0.6rem', borderRadius: '0.25rem' }}>
                        ACTIVE SELECTION
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
