import React from 'react';
import { Settings, Palette, Clock, Volume2, Sparkles } from 'lucide-react';

const THEMES = [
  { id: 'dark', label: 'Dark Glass', bg: '#0b0f19', border: '#1e293b' },
  { id: 'light', label: 'Light Crisp', bg: '#f1f5f9', border: '#cbd5e1' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', bg: '#090014', border: '#ec4899' },
  { id: 'oled', label: 'OLED Pitch Black', bg: '#000000', border: '#333333' },
];

const ACCENT_COLORS = [
  { id: 'cyan', label: 'Cyan', value: '#06b6d4', rgb: '6, 182, 212' },
  { id: 'violet', label: 'Violet', value: '#8b5cf6', rgb: '139, 92, 246' },
  { id: 'emerald', label: 'Emerald', value: '#10b981', rgb: '16, 185, 129' },
  { id: 'amber', label: 'Amber', value: '#f59e0b', rgb: '245, 158, 11' },
  { id: 'rose', label: 'Rose', value: '#ec4899', rgb: '236, 72, 153' },
  { id: 'blue', label: 'Electric Blue', value: '#3b82f6', rgb: '59, 130, 246' },
];

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  setTheme,
  accentColor,
  setAccentColor,
  faceStyle,
  setFaceStyle,
  isSweeping,
  setIsSweeping,
  soundEnabled,
  setSoundEnabled,
  volume,
  setVolume
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 1500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={22} style={{ color: 'var(--accent-color)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
              Dashboard Preferences
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.6rem', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Theme Selection */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Palette size={16} style={{ color: 'var(--accent-color)' }} />
              <span>Color Theme</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {THEMES.map(t => (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: t.bg,
                    border: theme === t.id ? '2px solid var(--accent-color)' : `1px solid ${t.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: t.border }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: t.id === 'light' ? '#0f172a' : '#f8fafc' }}>
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Accent Color Palette */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-color)' }} />
              <span>Accent Glow Color</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {ACCENT_COLORS.map(ac => (
                <button
                  key={ac.id}
                  onClick={() => setAccentColor(ac)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: ac.value,
                    border: accentColor.id === ac.id ? '3px solid #ffffff' : 'none',
                    boxShadow: accentColor.id === ac.id ? `0 0 15px ${ac.value}` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={ac.label}
                />
              ))}
            </div>
          </div>

          {/* Analog Face Style */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Clock size={16} style={{ color: 'var(--accent-color)' }} />
              <span>Analog Dial Style</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { id: 'chrono', label: 'Chronograph Subdials' },
                { id: 'classic', label: 'Classic Indices' },
                { id: 'minimal', label: 'Minimalist Clean' },
                { id: 'cyberpunk', label: 'Futuristic Cyber' }
              ].map(st => (
                <button
                  key={st.id}
                  className={`glass-button ${faceStyle === st.id ? 'active' : ''}`}
                  onClick={() => setFaceStyle(st.id)}
                  style={{ justifyContent: 'center', padding: '10px', fontSize: '0.82rem' }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hand Motion Toggle */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Smooth Sweeping Second Hand</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>60 FPS continuous motion</div>
              </div>
              <button
                className={`glass-button ${isSweeping ? 'active' : ''}`}
                onClick={() => setIsSweeping(!isSweeping)}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                {isSweeping ? 'Sweeping' : 'Ticking'}
              </button>
            </div>
          </div>

          {/* Audio Volume & Sound FX */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Volume2 size={16} style={{ color: 'var(--accent-color)' }} />
              <span>Audio & Tick Sounds</span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Enable Sound Effects</span>
                <button
                  className={`glass-button ${soundEnabled ? 'active' : ''}`}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                >
                  {soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Volume ({Math.round(volume * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
