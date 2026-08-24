import React, { useState } from 'react';
import { getTimeInZone, getUTCOffset } from '../utils/timezones';
import { SlidersHorizontal, Sun, Moon, Briefcase, RotateCcw } from 'lucide-react';

export default function TimeConverter({ cities, date, is24Hour }) {
  // Slider representing hours from 0 to 24 (step 0.5)
  const currentHour = date.getHours() + date.getMinutes() / 60;
  const [selectedHour, setSelectedHour] = useState(Math.round(currentHour * 2) / 2);
  const [baseCity, setBaseCity] = useState(cities[0] || null);

  const resetToCurrent = () => {
    const h = date.getHours() + date.getMinutes() / 60;
    setSelectedHour(Math.round(h * 2) / 2);
  };

  // Compute reference simulated date
  const simulatedDate = new Date(date);
  const baseH = Math.floor(selectedHour);
  const baseM = Math.round((selectedHour - baseH) * 60);
  simulatedDate.setHours(baseH, baseM, 0, 0);

  const pad = num => String(num).padStart(2, '0');
  const formatHourString = (hVal) => {
    const hrs = Math.floor(hVal);
    const mins = Math.round((hVal - hrs) * 60);
    if (is24Hour) {
      return `${pad(hrs)}:${pad(mins)}`;
    }
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const h12 = hrs % 12 || 12;
    return `${pad(h12)}:${pad(mins)} ${ampm}`;
  };

  const getStatusColor = (h) => {
    if (h >= 9 && h < 18) {
      return { label: 'Work Hours', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
    } else if ((h >= 7 && h < 9) || (h >= 18 && h < 22)) {
      return { label: 'Personal Time', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
    } else {
      return { label: 'Sleep Time', bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' };
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(var(--accent-rgb), 0.15)',
            color: 'var(--accent-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(var(--accent-rgb), 0.3)'
          }}>
            <SlidersHorizontal size={20} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Time Zone Converter & Meeting Planner
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Drag the time slider to calculate global time overlaps across all regions
            </p>
          </div>
        </div>

        <button className="glass-button" onClick={resetToCurrent}>
          <RotateCcw size={14} />
          <span>Reset to Now</span>
        </button>
      </div>

      {/* Primary Reference Time Selector */}
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '14px',
        border: '1px solid var(--card-border)',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Reference Time Slider:
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'var(--accent-color)',
            background: 'var(--bg-tertiary)',
            padding: '4px 14px',
            borderRadius: '10px',
            border: '1px solid var(--accent-color)'
          }}>
            {formatHourString(selectedHour)}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="23.5"
          step="0.5"
          value={selectedHour}
          onChange={(e) => setSelectedHour(parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '6px',
            accentColor: 'var(--accent-color)',
            cursor: 'pointer'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <span>00:00 (Midnight)</span>
          <span>06:00</span>
          <span>12:00 (Noon)</span>
          <span>18:00</span>
          <span>23:30</span>
        </div>
      </div>

      {/* Region Matrix Comparison List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cities.map((city) => {
          const zoneInfo = getTimeInZone(simulatedDate, city.timezone);
          const offset = getUTCOffset(city.timezone);
          const status = getStatusColor(zoneInfo.hours);

          return (
            <div
              key={city.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--card-border)',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              {/* City Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
                <span style={{ fontSize: '1.5rem' }}>{city.flag}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{city.city}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {city.country} • <span style={{ color: 'var(--accent-color)' }}>{offset}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '999px',
                background: status.bg,
                color: status.color,
                border: `1px solid ${status.border}`
              }}>
                {zoneInfo.isNight ? <Moon size={13} /> : <Sun size={13} />}
                <span>{status.label}</span>
              </div>

              {/* Time Result */}
              <div style={{ textAlign: 'right', minWidth: '160px' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)'
                }}>
                  {is24Hour ? zoneInfo.formattedTime24 : zoneInfo.formattedTime12}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {zoneInfo.dayName}, {zoneInfo.monthName} {zoneInfo.day}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
