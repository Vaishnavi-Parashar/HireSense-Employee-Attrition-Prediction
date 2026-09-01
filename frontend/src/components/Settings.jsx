import React from 'react';
import { Settings, User, Bell, Cpu, Palette, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="card-hs" style={{ borderLeft: '4px solid var(--violet)', background: 'var(--gradient-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--gradient-btn)', color: '#fff' }}>
            <Settings size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-deep-purple)' }}>
              Application &amp; Model Settings
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Configure workspace settings, model defaults, and visual preferences.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Model Configuration Card */}
        <div className="card-hs">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={20} style={{ color: 'var(--violet)' }} />
            <span>Model Defaults</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Default Prediction Model
              </label>
              <select style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}>
                <option value="Gradient Boosting">Gradient Boosting (Recommended - Acc 92.98%)</option>
                <option value="XGBoost">XGBoost (Acc 92.72%)</option>
                <option value="KNN">KNN (Acc 92.59%)</option>
                <option value="Random Forest">Random Forest (Acc 92.18%)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Risk Classification Threshold (%)
              </label>
              <input type="number" defaultValue={60} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }} />
            </div>
          </div>
        </div>

        {/* User Profile Settings */}
        <div className="card-hs">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} style={{ color: 'var(--magenta)' }} />
            <span>User Profile</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Display Name
              </label>
              <input type="text" defaultValue="Admin HR Manager" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Role &amp; Department
              </label>
              <input type="text" defaultValue="HR Analytics Lead" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
