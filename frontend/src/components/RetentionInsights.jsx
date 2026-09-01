import React from 'react';
import { Lightbulb, AlertOctagon, CheckCircle2, Shield, ArrowUpRight } from 'lucide-react';

export default function RetentionInsights() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="card-hs" style={{ borderLeft: '4px solid var(--magenta)', background: 'var(--gradient-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--gradient-btn)', color: '#fff' }}>
            <Lightbulb size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-deep-purple)' }}>
              Strategic Retention Insights
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Data-backed recommendations to reduce attrition across key vulnerable segments.
            </p>
          </div>
        </div>
      </div>

      {/* Top Attrition Drivers & High Risk Employee Groups */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1 */}
        <div className="card-hs">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertOctagon size={20} style={{ color: 'var(--coral)' }} />
            <span>Top Attrition Drivers</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: '#FFF5F5', border: '1px solid #FECDD3' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--coral)' }}>1. OverTime Intensity (62.4% Attrition Rate)</div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Employees working overtime are 2.4x more likely to leave the organization than standard hour workers.
              </p>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--violet)' }}>2. Low Job Satisfaction (Satisfaction 1-2)</div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Satisfaction level 1 or 2 represents the highest single correlation with voluntary resignation.
              </p>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#D97706' }}>3. Commute Friction & Distance (&gt;20 Miles)</div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Longer commutes combined with low Work-Life Balance accelerate 90-day departure risk.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Strategic Action Matrix */}
        <div className="card-hs">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} style={{ color: 'var(--violet)' }} />
            <span>Recommended HR Action Framework</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--primary-deep-purple)' }}>Cap OverTime Hours &amp; Rotate Shifts</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Implement workload caps for high-risk projects showing &gt;20 overtime hours monthly.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--primary-deep-purple)' }}>Flexible / Hybrid Remote Options</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Offer 2-day work-from-home options for employees commuting over 15 miles.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--primary-deep-purple)' }}>Stock Option &amp; Compensation Calibration</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Review stock option tiering for Job Level 2 &amp; 3 employees with high performance rating.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
