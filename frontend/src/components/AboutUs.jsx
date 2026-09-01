import React from 'react';
import { ArrowRight, Database, Sliders, Cpu, BarChart2, ShieldAlert, Sparkles } from 'lucide-react';

export default function AboutUs() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="card-hs" style={{ borderLeft: '4px solid var(--violet)', background: 'var(--gradient-hero)', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '680px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              HireSense — See Potential. Retain Talent.
            </h2>
            <p style={{ fontSize: '1rem', color: '#E9D5FF', lineHeight: 1.6 }}>
              An AI-powered employee analytics platform designed to help organizations identify attrition risks, understand workforce patterns, and support better employee retention decisions.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 20px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
          }}>
            <img 
              src="/hiresense_logo.png" 
              alt="HireSense Brand Logo" 
              style={{ height: '90px', objectFit: 'contain' }} 
            />
          </div>
        </div>
      </div>

      {/* Visual Workflow Diagram */}
      <div className="card-hs">
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', marginBottom: '1.5rem', textAlign: 'center' }}>
          End-to-End ML Architecture &amp; Data Pipeline
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '1rem 0' }}>
          {[
            { step: '1', title: 'Employee Data', icon: Database, desc: '100,000 Dataset Records' },
            { step: '2', title: 'Data Preprocessing', icon: Sliders, desc: 'StandardScaler & Clean' },
            { step: '3', title: 'Machine Learning', icon: Cpu, desc: 'GB, XGB, KNN, RF' },
            { step: '4', title: 'Prediction', icon: BarChart2, desc: 'Real-Time Inference' },
            { step: '5', title: 'Risk Analysis', icon: ShieldAlert, desc: 'High/Med/Low Risk' },
            { step: '6', title: 'Retention Insights', icon: Sparkles, desc: 'Actionable Advice' }
          ].map((node, idx, arr) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={idx}>
                <div style={{
                  flex: 1,
                  minWidth: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '1rem 0.5rem',
                  borderRadius: '0.75rem',
                  background: '#F9FAFB',
                  border: '1px solid #E9D5FF'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--gradient-btn)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <Icon size={20} />
                  </div>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--primary-deep-purple)', textAlign: 'center' }}>
                    {node.title}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.2rem' }}>
                    {node.desc}
                  </span>
                </div>

                {idx < arr.length - 1 && (
                  <ArrowRight size={20} style={{ color: 'var(--violet)', flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
