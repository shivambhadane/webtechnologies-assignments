import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Timer as TimerIcon, PlayCircle, Bell } from 'lucide-react';
import { playAlarmTone } from '../utils/audio';

export default function StopwatchTimer() {
  const [activeTab, setActiveTab] = useState('stopwatch'); // 'stopwatch' | 'timer'

  // --- STOPWATCH STATE ---
  const [swRunning, setSwRunning] = useState(false);
  const [swTime, setSwTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const swRef = useRef(null);

  useEffect(() => {
    if (swRunning) {
      const startTime = Date.now() - swTime;
      swRef.current = setInterval(() => {
        setSwTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(swRef.current);
    }
    return () => clearInterval(swRef.current);
  }, [swRunning]);

  const handleSwReset = () => {
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!swRunning) return;
    const prevTotal = laps.reduce((acc, l) => acc + l.lapTime, 0);
    const lapTime = swTime - prevTotal;
    setLaps([{ id: Date.now(), totalTime: swTime, lapTime }, ...laps]);
  };

  // Compute fastest & slowest laps
  let fastestIdx = -1;
  let slowestIdx = -1;
  if (laps.length > 1) {
    let minT = Infinity;
    let maxT = -1;
    laps.forEach((l, idx) => {
      if (l.lapTime < minT) {
        minT = l.lapTime;
        fastestIdx = idx;
      }
      if (l.lapTime > maxT) {
        maxT = l.lapTime;
        slowestIdx = idx;
      }
    });
  }

  // --- TIMER STATE ---
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInitial, setTimerInitial] = useState(300); // 5 mins in seconds
  const [timerRemaining, setTimerRemaining] = useState(300);
  const timerRef = useRef(null);

  // Inputs
  const [inputH, setInputH] = useState(0);
  const [inputM, setInputM] = useState(5);
  const [inputS, setInputS] = useState(0);

  const applyCustomTimer = (h, m, s) => {
    const total = h * 3600 + m * 60 + s;
    setTimerInitial(total);
    setTimerRemaining(total);
    setTimerRunning(false);
  };

  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            playAlarmTone('synth_pulse', 0.9);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerRemaining]);

  const handleTimerReset = () => {
    setTimerRunning(false);
    setTimerRemaining(timerInitial);
  };

  // Helper time formatters
  const formatMs = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const millis = Math.floor((ms % 1000) / 10);

    const pad = n => String(n).padStart(2, '0');
    return `${hrs > 0 ? pad(hrs) + ':' : ''}${pad(mins)}:${pad(secs)}.${pad(millis)}`;
  };

  const formatTimerSecs = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = n => String(n).padStart(2, '0');
    return `${hrs > 0 ? pad(hrs) + ':' : ''}${pad(mins)}:${pad(s)}`;
  };

  // Timer Progress Ring Calculations
  const radius = 100;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const timerPercent = timerInitial > 0 ? timerRemaining / timerInitial : 0;
  const strokeDashoffset = circumference - timerPercent * circumference;

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      
      {/* Header & Tabs */}
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
            <TimerIcon size={20} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Stopwatch & Countdown Timer
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Precision sports timing & countdown management
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px' }}>
          <button
            className={`glass-button ${activeTab === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setActiveTab('stopwatch')}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            Stopwatch
          </button>
          <button
            className={`glass-button ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            Countdown Timer
          </button>
        </div>
      </div>

      {/* STOPWATCH TAB */}
      {activeTab === 'stopwatch' && (
        <div>
          {/* Large Time Display */}
          <div style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '4.2rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '20px 0',
            textShadow: '0 0 25px rgba(var(--accent-rgb), 0.3)'
          }}>
            {formatMs(swTime)}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '28px' }}>
            <button
              className={`glass-button ${swRunning ? '' : 'active'}`}
              onClick={() => setSwRunning(!swRunning)}
              style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 700 }}
            >
              {swRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{swRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              className="glass-button"
              onClick={handleLap}
              disabled={!swRunning}
              style={{ padding: '12px 24px', opacity: swRunning ? 1 : 0.5 }}
            >
              <Flag size={18} />
              <span>Lap</span>
            </button>

            <button
              className="glass-button"
              onClick={handleSwReset}
              style={{ padding: '12px 24px' }}
            >
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>

          {/* Laps List Table */}
          {laps.length > 0 && (
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '14px', padding: '16px', border: '1px solid var(--card-border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                Lap Splits ({laps.length})
              </div>

              <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {laps.map((lap, index) => {
                  const isFastest = index === fastestIdx;
                  const isSlowest = index === slowestIdx;
                  const lapNumber = laps.length - index;

                  return (
                    <div
                      key={lap.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'var(--bg-tertiary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        borderLeft: isFastest ? '4px solid #10b981' : isSlowest ? '4px solid #ef4444' : '4px solid transparent'
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>
                        Lap {lapNumber}
                        {isFastest && <span style={{ fontSize: '0.72rem', color: '#10b981', marginLeft: '8px' }}>(Fastest)</span>}
                        {isSlowest && <span style={{ fontSize: '0.72rem', color: '#ef4444', marginLeft: '8px' }}>(Slowest)</span>}
                      </div>

                      <div style={{ color: 'var(--text-muted)' }}>
                        Split: {formatMs(lap.lapTime)}
                      </div>

                      <div style={{ fontWeight: 700, color: 'var(--accent-color)' }}>
                        {formatMs(lap.totalTime)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TIMER TAB */}
      {activeTab === 'timer' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', margin: '20px 0' }}>
            
            {/* SVG Progress Ring */}
            <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="240" height="240" viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)' }}>
                {/* Track */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  stroke="var(--bg-tertiary)"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress Ring */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  stroke="var(--accent-color)"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>

              {/* Time Inner Text */}
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2.8rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)'
                }}>
                  {formatTimerSecs(timerRemaining)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {timerRunning ? 'Countdown Active' : timerRemaining === 0 ? 'TIME UP!' : 'Paused'}
                </div>
              </div>
            </div>

            {/* Presets & Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px', width: '100%' }}>
              
              {/* Custom Time Inputs */}
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Set Custom Duration:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hours</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={inputH}
                      onChange={(e) => {
                        const h = Math.max(0, parseInt(e.target.value) || 0);
                        setInputH(h);
                        applyCustomTimer(h, inputM, inputS);
                      }}
                      style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '8px',
                        padding: '6px',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'center',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mins</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={inputM}
                      onChange={(e) => {
                        const m = Math.max(0, parseInt(e.target.value) || 0);
                        setInputM(m);
                        applyCustomTimer(inputH, m, inputS);
                      }}
                      style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '8px',
                        padding: '6px',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'center',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Secs</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={inputS}
                      onChange={(e) => {
                        const s = Math.max(0, parseInt(e.target.value) || 0);
                        setInputS(s);
                        applyCustomTimer(inputH, inputM, s);
                      }}
                      style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '8px',
                        padding: '6px',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'center',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Quick Presets:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { label: '1m', s: 60 },
                  { label: '5m', s: 300 },
                  { label: '10m', s: 600 },
                  { label: '15m', s: 900 },
                  { label: '25m', s: 1500 },
                  { label: '45m', s: 2700 },
                ].map(p => (
                  <button
                    key={p.label}
                    className="glass-button"
                    onClick={() => {
                      const m = p.s / 60;
                      setInputH(0);
                      setInputM(m);
                      setInputS(0);
                      applyCustomTimer(0, m, 0);
                    }}
                    style={{ justifyContent: 'center', padding: '8px' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  className={`glass-button ${timerRunning ? '' : 'active'}`}
                  onClick={() => setTimerRunning(!timerRunning)}
                  style={{ flex: 1, justifyContent: 'center', padding: '12px', fontWeight: 700 }}
                >
                  {timerRunning ? <Pause size={18} /> : <Play size={18} />}
                  <span>{timerRunning ? 'Pause' : 'Start'}</span>
                </button>

                <button
                  className="glass-button"
                  onClick={handleTimerReset}
                  style={{ padding: '12px' }}
                >
                  <RotateCcw size={18} />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
