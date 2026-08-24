import React, { useState } from 'react';
import { AlarmClock, Plus, Trash2, Bell, Check, Play, Volume2, ShieldAlert } from 'lucide-react';
import { playAlarmTone } from '../utils/audio';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CATEGORIES = [
  { id: 'work', label: 'Work', icon: '💼', color: '#06b6d4' },
  { id: 'personal', label: 'Personal', icon: '👤', color: '#a855f7' },
  { id: 'fitness', label: 'Fitness', icon: '🏋️', color: '#10b981' },
  { id: 'health', label: 'Health', icon: '💊', color: '#ef4444' },
];

export default function AlarmManager({
  alarms,
  onAddAlarm,
  onToggleAlarm,
  onDeleteAlarm,
  date,
  isModalOpen,
  setIsModalOpen
}) {
  const [title, setTitle] = useState('');
  const [timeStr, setTimeStr] = useState('08:00');
  const [category, setCategory] = useState('work');
  const [sound, setSound] = useState('digital_beep');
  const [snooze, setSnooze] = useState(5);
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri default

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!timeStr) return;

    const [h, m] = timeStr.split(':').map(Number);
    const newAlarm = {
      id: Date.now().toString(),
      title: title || 'Alarm',
      hours: h,
      minutes: m,
      category,
      sound,
      snoozeMinutes: snooze,
      days: selectedDays,
      enabled: true,
      lastTriggered: null
    };

    onAddAlarm(newAlarm);
    setIsModalOpen(false);
    setTitle('');
  };

  const toggleDay = (dayIndex) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  // Find nearest active alarm
  const getNearestAlarmCountdown = () => {
    const active = alarms.filter(a => a.enabled);
    if (active.length === 0) return null;

    const nowMinutes = date.getHours() * 60 + date.getMinutes();
    const currentDay = date.getDay();

    let minDiff = Infinity;
    let nearest = null;

    active.forEach(a => {
      const alarmMinutes = a.hours * 60 + a.minutes;
      let diff = alarmMinutes - nowMinutes;

      if (diff <= 0) {
        diff += 24 * 60; // Next day
      }

      if (diff < minDiff) {
        minDiff = diff;
        nearest = a;
      }
    });

    if (!nearest) return null;

    const diffHours = Math.floor(minDiff / 60);
    const diffMins = minDiff % 60;

    return {
      alarm: nearest,
      countdown: `${diffHours > 0 ? `${diffHours}h ` : ''}${diffMins}m`
    };
  };

  const nearestInfo = getNearestAlarmCountdown();

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: 'var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <AlarmClock size={20} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Alarm System
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              {alarms.filter(a => a.enabled).length} of {alarms.length} alarms active
            </p>
          </div>
        </div>

        <button 
          className="glass-button active"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          <span>New Alarm</span>
        </button>
      </div>

      {/* Nearest Alarm Banner */}
      {nearestInfo && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '12px 18px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={18} style={{ color: 'var(--color-danger)', animation: 'pulseGlow 2s infinite' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Next alarm: <strong style={{ color: 'var(--text-primary)' }}>{nearestInfo.alarm.title}</strong>
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--color-danger)',
            background: 'var(--bg-primary)',
            padding: '4px 10px',
            borderRadius: '6px'
          }}>
            in {nearestInfo.countdown}
          </span>
        </div>
      )}

      {/* Alarms List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alarms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No alarms set. Click "New Alarm" to schedule your first alert!
          </div>
        ) : (
          alarms.map((alarm) => {
            const pad = n => String(n).padStart(2, '0');
            const h12 = alarm.hours % 12 || 12;
            const ampm = alarm.hours >= 12 ? 'PM' : 'AM';
            const catObj = CATEGORIES.find(c => c.id === alarm.category) || CATEGORIES[0];

            return (
              <div
                key={alarm.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: 'var(--bg-secondary)',
                  border: alarm.enabled ? '1px solid var(--accent-color)' : '1px solid var(--card-border)',
                  opacity: alarm.enabled ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                {/* Alarm Time & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: alarm.enabled ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}>
                    {pad(h12)}:{pad(alarm.minutes)} <span style={{ fontSize: '0.9rem' }}>{ampm}</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem' }}>{catObj.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{alarm.title}</span>
                    </div>

                    {/* Days badges */}
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {DAYS.map((d, idx) => {
                        const isSelected = alarm.days.includes(idx);
                        return (
                          <span
                            key={d}
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 5px',
                              borderRadius: '4px',
                              background: isSelected ? 'rgba(var(--accent-rgb), 0.2)' : 'transparent',
                              color: isSelected ? 'var(--accent-color)' : 'var(--text-muted)'
                            }}
                          >
                            {d[0]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Actions: Sound Demo, Toggle Switch, Delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    className="glass-button"
                    onClick={() => playAlarmTone(alarm.sound)}
                    title="Test Alarm Sound"
                    style={{ padding: '6px 10px' }}
                  >
                    <Volume2 size={14} />
                  </button>

                  {/* Custom Toggle Switch */}
                  <div
                    onClick={() => onToggleAlarm(alarm.id)}
                    style={{
                      width: '46px',
                      height: '24px',
                      borderRadius: '999px',
                      background: alarm.enabled ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                      padding: '2px',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      transform: alarm.enabled ? 'translateX(22px)' : 'translateX(0)',
                      transition: 'transform 0.2s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }} />
                  </div>

                  <button
                    className="glass-button"
                    onClick={() => onDeleteAlarm(alarm.id)}
                    style={{ color: 'var(--color-danger)', padding: '6px 10px' }}
                    title="Delete Alarm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create Alarm */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '24px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlarmClock size={20} style={{ color: 'var(--accent-color)' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  Set New Alarm
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Time Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Alarm Time
                </label>
                <input
                  type="time"
                  className="glass-input"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  required
                  style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '1.4rem', textAlign: 'center' }}
                />
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Label / Description
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Morning Sync, Workout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`glass-button ${category === cat.id ? 'active' : ''}`}
                      onClick={() => setCategory(cat.id)}
                      style={{ flexDirection: 'column', padding: '8px', fontSize: '0.75rem', gap: '4px' }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound & Snooze */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Tone Sound
                  </label>
                  <select
                    className="glass-input"
                    value={sound}
                    onChange={(e) => setSound(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="digital_beep">Digital Beep</option>
                    <option value="gentle_chime">Gentle Chime</option>
                    <option value="synth_pulse">Synth Pulse</option>
                    <option value="radar_ping">Sonar Radar</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Snooze Time
                  </label>
                  <select
                    className="glass-input"
                    value={snooze}
                    onChange={(e) => setSnooze(Number(e.target.value))}
                    style={{ width: '100%' }}
                  >
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                  </select>
                </div>
              </div>

              {/* Days Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Repeat Days
                </label>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
                  {DAYS.map((day, idx) => (
                    <button
                      key={day}
                      type="button"
                      className={`glass-button ${selectedDays.includes(idx) ? 'active' : ''}`}
                      onClick={() => toggleDay(idx)}
                      style={{ flex: 1, padding: '6px 0', justifyContent: 'center', fontSize: '0.75rem' }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="glass-button active"
                style={{ marginTop: '12px', justifyContent: 'center', padding: '12px' }}
              >
                Save Alarm
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
