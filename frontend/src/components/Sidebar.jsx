import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  TrendingDown, 
  Lightbulb, 
  Users, 
  FileText, 
  Bot, 
  Settings, 
  Info,
  Sparkles,
  X
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'prediction', label: 'Attrition Prediction', icon: BrainCircuit },
  { id: 'performance', label: 'Performance Risk', icon: TrendingDown },
  { id: 'insights', label: 'Retention Insights', icon: Lightbulb },
  { id: 'analytics', label: 'Employee Analytics', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'assistant', label: 'AI Assistant', icon: Bot },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About Us', icon: Info },
];

export default function Sidebar({ activePage, setActivePage, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40
          }}
        />
      )}

      <aside style={{
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        color: '#FFFFFF',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        transition: 'transform 0.3s ease',
        transform: isOpen ? 'translateX(0)' : (window.innerWidth < 1024 ? 'translateX(-100%)' : 'translateX(0)'),
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
      }}>
        {/* Top Sidebar Header with Enhanced HireSense Logo Display */}
        <div>
          <div style={{
            padding: '1rem 0.85rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              width: '90%',
              minHeight: '72px',
              margin: '0 auto'
            }}>
              <img 
                src="/hiresense_logo.png" 
                alt="HireSense Official Logo" 
                style={{ 
                  width: '100%',
                  maxWidth: '145px',
                  maxHeight: '66px',
                  objectFit: 'contain'
                }} 
              />
            </div>
            {window.innerWidth < 1024 && (
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.625rem',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    color: isActive ? '#FFFFFF' : '#A78BFA',
                    background: isActive ? 'var(--gradient-btn)' : 'transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(124, 58, 237, 0.35)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} style={{ color: isActive ? '#FFFFFF' : '#C4B5FD' }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Motivational Card */}
        <div style={{ padding: '1rem 0.75rem 1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(217, 70, 239, 0.2) 100%)',
            border: '1px solid rgba(196, 181, 253, 0.2)',
            borderRadius: '0.875rem',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#F472B6' }}>
              <Sparkles size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>HireSense AI</span>
            </div>
            <p style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#F3E8FF',
              lineHeight: 1.4
            }}>
              "Smarter Decisions.<br />
              Stronger Teams.<br />
              Better Tomorrow."
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
