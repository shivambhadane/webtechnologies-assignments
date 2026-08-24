import React, { useEffect } from 'react';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAlarmTone } from '../utils/audio';

export default function AlarmModal({ alarm, onDismiss, onSnooze }) {
  useEffect(() => {
    // Loop play alarm sound every second while open
    const interval = setInterval(() => {
      if (alarm) {
        playAlarmTone(alarm.sound || 'digital_beep');
      }
    }, 900);

    // Initial play
    playAlarmTone(alarm?.sound || 'digital_beep');

    return () => clearInterval(interval);
  }, [alarm]);

  if (!alarm) return null;

  const handleDismiss = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    onDismiss(alarm.id);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel alarm-ringing" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '36px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(30,10,10,0.9) 0%, rgba(20,5,5,0.95) 100%)',
        border: '2px solid var(--color-danger)'
      }}>
        
        {/* Animated Bell */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.2)',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          border: '2px solid var(--color-danger)',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
        }}>
          <Bell size={42} className="alarm-ringing" />
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>
          {alarm.title || 'ALARM RINGS!'}
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0 0 28px 0' }}>
          Scheduled time reached. Take action below:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <button
            className="glass-button"
            onClick={handleDismiss}
            style={{
              background: 'var(--color-danger)',
              color: '#ffffff',
              borderColor: 'var(--color-danger)',
              justifyContent: 'center',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
            }}
          >
            <CheckCircle2 size={20} />
            <span>Dismiss Alarm</span>
          </button>

          <button
            className="glass-button"
            onClick={() => onSnooze(alarm.id, alarm.snoozeMinutes || 5)}
            style={{
              justifyContent: 'center',
              padding: '12px',
              fontSize: '0.95rem'
            }}
          >
            <span>Snooze (+{alarm.snoozeMinutes || 5} min)</span>
          </button>

        </div>

      </div>
    </div>
  );
}
