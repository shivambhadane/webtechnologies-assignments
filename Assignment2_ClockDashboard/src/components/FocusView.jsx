import React from 'react';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import { getTimeInZone, getUTCOffset, getTimeDiffFromLocal } from '../utils/timezones';
import { Sun, Moon, Compass, MapPin, Globe } from 'lucide-react';

export default function FocusView({
  city,
  cities,
  onSelectFocusCity,
  date,
  is24Hour,
  setIs24Hour,
  faceStyle,
  isSweeping
}) {
  if (!city) return null;

  const zoneInfo = getTimeInZone(date, city.timezone);
  const timeDiff = getTimeDiffFromLocal(city.timezone);
  const offset = getUTCOffset(city.timezone);

  // Solar position calculation percentage (0% midnight, 50% noon, 100% midnight)
  const dayProgress = ((zoneInfo.hours * 3600 + zoneInfo.minutes * 60 + zoneInfo.seconds) / 86400) * 100;

  return (
    <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Ambient Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: zoneInfo.isNight 
          ? 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(0,0,0,0) 70%)'
          : 'radial-gradient(circle, rgba(var(--accent-rgb), 0.25) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(50px)'
      }} />

      {/* Focus City Selector Pill Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px' }}>
          <Globe size={16} /> Focus City:
        </span>

        {cities.map(c => (
          <button
            key={c.id}
            className={`glass-button ${city.id === c.id ? 'active' : ''}`}
            onClick={() => onSelectFocusCity(c)}
            style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '999px' }}
          >
            <span>{c.flag}</span>
            <span>{c.city}</span>
          </button>
        ))}
      </div>

      {/* Main Focus Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 16px', borderRadius: '999px', border: '1px solid var(--card-border)', marginBottom: '12px' }}>
          <MapPin size={16} style={{ color: 'var(--accent-color)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{city.city}, {city.country}</span>
          <span style={{ color: 'var(--accent-color)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>({offset})</span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          Region Spotlight
        </h2>
      </div>

      {/* Center Dual Clock Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '36px',
        alignItems: 'center',
        marginBottom: '36px'
      }}>
        {/* Analog Clock */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AnalogClock
            date={date}
            timezone={city.timezone}
            size={290}
            faceStyle={faceStyle}
            isSweeping={isSweeping}
            showSubdials={true}
            city={city.city}
          />
        </div>

        {/* Digital Clock */}
        <div>
          <DigitalClock
            date={date}
            timezone={city.timezone}
            cityName={city.city}
            is24Hour={is24Hour}
            showSeconds={true}
            showMillis={true}
            onToggleFormat={() => setIs24Hour(!is24Hour)}
          />
        </div>
      </div>

      {/* Solar Day / Night Curve Visualizer */}
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '20px 24px',
        borderRadius: '16px',
        border: '1px solid var(--card-border)',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {zoneInfo.isNight ? <Moon size={16} style={{ color: '#c084fc' }} /> : <Sun size={16} style={{ color: '#fbbf24' }} />}
            <span>Diurnal Sun Position (24-Hour Cycle)</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-color)' }}>
            {Math.round(dayProgress)}% of Day Complete
          </span>
        </div>

        {/* Solar Progress Bar */}
        <div style={{
          height: '10px',
          borderRadius: '999px',
          background: 'linear-gradient(90deg, #1e1b4b 0%, #f59e0b 25%, #38bdf8 50%, #f59e0b 75%, #1e1b4b 100%)',
          position: 'relative',
          overflow: 'visible',
          marginTop: '8px'
        }}>
          {/* Current Time Indicator Pin */}
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: `${dayProgress}%`,
            transform: 'translateX(-50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '3px solid var(--accent-color)',
            boxShadow: 'var(--accent-glow)',
            transition: 'left 0.5s ease'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <span>00:00 Night</span>
          <span>06:00 Sunrise 🌅</span>
          <span>12:00 Solar Noon ☀️</span>
          <span>18:00 Sunset 🌇</span>
          <span>24:00 Night</span>
        </div>
      </div>

    </div>
  );
}
