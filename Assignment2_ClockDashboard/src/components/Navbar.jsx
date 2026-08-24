import React from 'react';
import { 
  Clock, 
  Search, 
  Globe, 
  SlidersHorizontal, 
  AlarmClock, 
  Timer, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize2, 
  Minimize2,
  Compass
} from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  is24Hour,
  setIs24Hour,
  soundEnabled,
  setSoundEnabled,
  onOpenSettings,
  onOpenAddAlarm,
  isFullscreen,
  toggleFullscreen,
  activeAlarmsCount,
  searchQuery,
  setSearchQuery
}) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      paddingBottom: '24px',
      borderBottom: '1px solid var(--card-border)',
      marginBottom: '32px'
    }}>
      
      {/* Brand Logo & Name */}
      <div 
        onClick={() => setActiveView('grid')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'var(--text-primary)',
          color: 'var(--container-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800
        }}>
          <Clock size={20} strokeWidth={2.5} />
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)'
        }}>
          TimeSpot
        </span>
      </div>

      {/* Center Search Input */}
      <div style={{
        position: 'relative',
        flex: '1',
        maxWidth: '320px',
        minWidth: '200px'
      }}>
        <Search 
          size={16} 
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} 
        />
        <input 
          type="text"
          placeholder="Search city or timezone..."
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 16px 8px 38px',
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
        />
      </div>

      {/* Right Controls & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        
        {/* Navigation View Switcher Pills */}
        <div className="pill-toggle">
          <button 
            className={`pill-option ${activeView === 'grid' ? 'active' : ''}`}
            onClick={() => setActiveView('grid')}
          >
            Dashboard
          </button>
          <button 
            className={`pill-option ${activeView === 'analog' ? 'active' : ''}`}
            onClick={() => setActiveView('analog')}
          >
            Analog
          </button>
          <button 
            className={`pill-option ${activeView === 'converter' ? 'active' : ''}`}
            onClick={() => setActiveView('converter')}
          >
            Converter
          </button>
          <button 
            className={`pill-option ${activeView === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setActiveView('stopwatch')}
          >
            Timer
          </button>
        </div>

        {/* 12h / 24h Toggle Pill */}
        <div className="pill-toggle">
          <button 
            className={`pill-option ${!is24Hour ? 'active' : ''}`}
            onClick={() => setIs24Hour(false)}
          >
            12h
          </button>
          <button 
            className={`pill-option ${is24Hour ? 'active' : ''}`}
            onClick={() => setIs24Hour(true)}
          >
            24h
          </button>
        </div>

        {/* Alarm Trigger */}
        <button 
          onClick={onOpenAddAlarm}
          title="Alarms"
          style={{
            position: 'relative',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          <AlarmClock size={16} />
          {activeAlarmsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: '14px',
              height: '14px',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {activeAlarmsCount}
            </span>
          )}
        </button>

        {/* Sound Toggle */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute' : 'Unmute'}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: soundEnabled ? 'var(--accent-orange)' : 'var(--text-muted)'
          }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Settings Drawer Trigger */}
        <button 
          onClick={onOpenSettings}
          title="Settings"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          <Settings size={16} />
        </button>

      </div>

    </header>
  );
}
