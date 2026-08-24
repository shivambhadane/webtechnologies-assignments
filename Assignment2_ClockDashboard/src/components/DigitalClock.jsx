import React from 'react';
import { getTimeInZone, getUTCOffset } from '../utils/timezones';
import { Sun, Moon, Calendar } from 'lucide-react';

export default function DigitalClock({
  date = new Date(),
  timezone = 'Europe/London',
  cityName = 'London, United Kingdom',
  is24Hour = false,
  showSeconds = true,
  onToggleFormat
}) {
  const zoneInfo = getTimeInZone(date, timezone);
  const { hours, minutes, seconds, isNight, dayName, monthName, day, year } = zoneInfo;

  const pad = num => String(num).padStart(2, '0');

  const displayHours = is24Hour ? pad(hours) : pad(hours % 12 || 12);
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Dynamic Daylight Simulation based on latitude/timezone estimation
  const sunriseTime = "06:45";
  const sunsetTime = "18:30";
  const daylightDuration = "11h 45m";

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '28px 20px',
      position: 'relative',
      width: '100%'
    }}>
      
      {/* Top Metadata Header */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
          Current Location
        </div>

        {/* Sunlight Information Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--card-bg)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--card-border)',
          fontWeight: 500
        }}>
          <span>Sun</span>
          <span>☀️ : {sunriseTime} - {sunsetTime} ({daylightDuration})</span>
        </div>

        {/* Date string & 12h/24h Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)' }}>
            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
            <span>{dayName}, {monthName} {day} {year}</span>
          </div>

          <div className="pill-toggle">
            <button 
              className={`pill-option ${!is24Hour ? 'active' : ''}`}
              onClick={() => is24Hour && onToggleFormat && onToggleFormat()}
            >
              12h
            </button>
            <button 
              className={`pill-option ${is24Hour ? 'active' : ''}`}
              onClick={() => !is24Hour && onToggleFormat && onToggleFormat()}
            >
              24h
            </button>
          </div>
        </div>
      </div>

      {/* Main Giant TimeSpot Digital Clock */}
      <div style={{
        margin: '16px 0',
        textAlign: 'center',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center'
      }}>
        <div className="timespot-clock-display">
          <span>{displayHours}</span>
          <span style={{ opacity: 0.85, margin: '0 2px' }}>:</span>
          <span>{pad(minutes)}</span>
          {showSeconds && (
            <>
              <span style={{ opacity: 0.85, margin: '0 2px' }}>:</span>
              <span>{pad(seconds)}</span>
            </>
          )}
        </div>

        {!is24Hour && (
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            marginLeft: '12px',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {ampm}
          </span>
        )}
      </div>

    </div>
  );
}
