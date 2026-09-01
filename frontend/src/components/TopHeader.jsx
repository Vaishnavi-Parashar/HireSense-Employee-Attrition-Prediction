import React from 'react';
import { Search, Bell, Bot, Menu } from 'lucide-react';

const pageTitles = {
  dashboard: 'Dashboard',
  prediction: 'Attrition Prediction',
  performance: 'Performance Risk',
  insights: 'Retention Insights',
  analytics: 'Employee Analytics',
  reports: 'Reports',
  assistant: 'AI Assistant',
  settings: 'Settings',
  about: 'About Us'
};

export default function TopHeader({ activePage, setActivePage, onMenuToggle }) {
  return (
    <header style={{
      height: '76px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
    }}>
      {/* Left side: Mobile menu toggle + Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onMenuToggle}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.375rem'
          }}
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--primary-deep-purple)',
            lineHeight: 1.2
          }}>
            {pageTitles[activePage] || 'Dashboard'}
          </h1>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            HireSense Workspace &gt; {pageTitles[activePage] || 'Dashboard'}
          </div>
        </div>
      </div>

      {/* Right side: Search, AI Shortcut, Notifications, User Profile & PROMINENT RIGHT-MOST LOGO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search employees..." 
            style={{
              padding: '0.45rem 0.85rem 0.45rem 2.25rem',
              fontSize: '0.8125rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              backgroundColor: '#F9FAFB',
              outline: 'none',
              width: '180px'
            }}
          />
        </div>

        {/* AI Shortcut Button */}
        <button 
          onClick={() => setActivePage('assistant')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #E9D5FF',
            backgroundColor: '#F5F3FF',
            color: 'var(--violet)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Bot size={16} />
          <span>AI Assistant</span>
        </button>

        {/* Notification Icon */}
        <button style={{
          background: '#F3F4F6',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-main)',
          position: 'relative'
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--coral)',
            borderRadius: '50%'
          }} />
        </button>

        {/* Generic User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          paddingLeft: '0.5rem',
          borderLeft: '1px solid var(--border-color)'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'var(--gradient-btn)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            HA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-deep-purple)', lineHeight: 1.1 }}>
              Hi, Admin
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              HR Manager
            </span>
          </div>
        </div>

        {/* PROMINENT RIGHT-MOST CORNER HIRE SENSE LOGO */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '0.75rem',
          borderLeft: '1.5px solid var(--border-color)'
        }}>
          <div style={{
            background: '#FFFFFF',
            padding: '4px 8px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(124, 58, 237, 0.15)',
            border: '1.5px solid #E9D5FF',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <img 
              src="/hiresense_logo.png" 
              alt="HireSense Brand Logo" 
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
