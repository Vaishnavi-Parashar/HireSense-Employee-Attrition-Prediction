import React from 'react';
import { TrendingDown, AlertCircle, Info, Shield, CheckCircle } from 'lucide-react';

export default function PerformanceRisk() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="card-hs" style={{ borderLeft: '4px solid var(--warm-orange)', background: 'var(--gradient-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--gradient-coral)', color: '#fff' }}>
            <TrendingDown size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-deep-purple)' }}>
              Workforce Performance Risk Monitoring
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Identify workload friction, burnout warning signs, and performance satisfaction trends.
            </p>
          </div>
        </div>
      </div>

      {/* Explicit Architecture Disclaimer */}
      <div style={{ padding: '0.85rem 1.25rem', borderRadius: '0.75rem', background: '#FEF3C7', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Info size={20} style={{ color: '#D97706', flexShrink: 0 }} />
        <span style={{ fontSize: '0.8125rem', color: '#92400E', lineHeight: 1.4 }}>
          <strong>Architecture Note:</strong> Performance risk analytics are structured around job satisfaction ratings, overtime intensity, and job levels from the dataset. Primary ML classification models evaluate Attrition Risk.
        </span>
      </div>

      {/* Performance KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card-hs">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>High Performance Risk</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--coral)', marginTop: '0.25rem' }}>14.2%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Low satisfaction + Overtime mandatory</div>
        </div>

        <div className="card-hs">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Moderate Performance Risk</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#D97706', marginTop: '0.25rem' }}>31.5%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Satisfaction level 2 with long commute</div>
        </div>

        <div className="card-hs">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Optimal Performance</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>54.3%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>High satisfaction + Work-life balance 3-4</div>
        </div>
      </div>

      {/* Performance Risk Factors */}
      <div className="card-hs">
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1rem' }}>
          Performance Risk Breakdown by Job Level
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { level: 'Job Level 1 (Entry)', riskPct: 24.5, count: 'Entry-level burnout from high overtime', color: 'var(--coral)' },
            { level: 'Job Level 2 (Associate)', riskPct: 18.2, count: 'Mid-shift transitions and compensation alignment', color: '#D97706' },
            { level: 'Job Level 3 (Mid Level)', riskPct: 11.4, count: 'Balanced performance, high stock option retention', color: 'var(--violet)' },
            { level: 'Job Level 4 (Senior)', riskPct: 8.7, count: 'Strong engagement, high satisfaction scores', color: '#059669' },
            { level: 'Job Level 5 (Executive)', riskPct: 4.1, count: 'Very low risk, high organizational alignment', color: '#059669' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600 }}>
                <span>{item.level} — <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{item.count}</span></span>
                <span>{item.riskPct}% Risk</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${item.riskPct * 3.5}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
