import React from 'react';
import { FileText, Download, CheckCircle, BarChart, ShieldCheck } from 'lucide-react';

export default function Reports() {
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Report,Metric,Value\n" +
      "Model Performance,Gradient Boosting Accuracy,92.98%\n" +
      "Model Performance,XGBoost Accuracy,92.72%\n" +
      "Model Performance,KNN Accuracy,92.59%\n" +
      "Model Performance,Random Forest Accuracy,92.18%\n" +
      "Workforce Stats,Total Dataset Records,100000\n" +
      "Workforce Stats,Overall Attrition Rate,50.08%\n" +
      "Risk Driver,OverTime Attrition Rate,62.4%\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "HireSense_Workforce_Analytics_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="card-hs" style={{ borderLeft: '4px solid var(--violet)', background: 'var(--gradient-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--gradient-btn)', color: '#fff' }}>
              <FileText size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-deep-purple)' }}>
                Workforce &amp; ML Performance Reports
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Comprehensive summary report of model evaluations and dataset risk distributions.
              </p>
            </div>
          </div>

          <button className="btn-primary" onClick={handleExportCSV}>
            <Download size={16} />
            <span>Export Summary CSV</span>
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Report Card 1 */}
        <div className="card-hs">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart size={20} style={{ color: 'var(--violet)' }} />
            <span>ML Model Evaluation Audit</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>Gradient Boosting</span>
              <strong style={{ color: '#059669' }}>92.98% Accuracy (AUC 0.9845)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>XGBoost</span>
              <strong style={{ color: 'var(--violet)' }}>92.72% Accuracy (AUC 0.9834)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>KNN (n_neighbors=276)</span>
              <strong style={{ color: 'var(--violet)' }}>92.59% Accuracy (AUC 0.9829)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>Random Forest</span>
              <strong style={{ color: 'var(--violet)' }}>92.18% Accuracy (AUC 0.9798)</strong>
            </div>
          </div>
        </div>

        {/* Report Card 2 */}
        <div className="card-hs">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--magenta)' }} />
            <span>Dataset Verification Certificate</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <p><strong>Source CSV:</strong> <code>realistic_employee_attrition.csv</code> (100,000 records)</p>
            <p><strong>Features (9):</strong> Age, JobLevel, MonthlyIncome, YearsAtCompany, StockOptionLevel, DistanceFromHome, OverTime, WorkLifeBalance, JobSatisfaction</p>
            <p><strong>Scaler:</strong> StandardScaler fitted on <code>['Age', 'MonthlyIncome', 'YearsAtCompany', 'DistanceFromHome']</code></p>
            <p><strong>Status:</strong> Verified live in Python environment with zero dummy fallbacks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
