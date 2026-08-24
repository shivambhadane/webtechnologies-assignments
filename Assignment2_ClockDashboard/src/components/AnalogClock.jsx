import React, { useState, useRef } from 'react';
import { getTimeInZone } from '../utils/timezones';

export default function AnalogClock({
  date = new Date(),
  timezone = 'UTC',
  size = 280,
  faceStyle = 'chrono',
  isSweeping = true,
  showSubdials = true,
  city = ''
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Get zone time parameters
  const zoneInfo = getTimeInZone(date, timezone);
  const { hours, minutes, seconds, milliseconds, formattedTime12, day, monthName } = zoneInfo;

  // Angles calculation
  const secFraction = isSweeping ? (seconds + milliseconds / 1000) : seconds;
  const secAngle = secFraction * 6; // 360 / 60
  const minAngle = (minutes + secFraction / 60) * 6;
  const hourAngle = ((hours % 12) + minutes / 60 + secFraction / 3600) * 30; // 360 / 12

  // Interactive 3D Parallax tilt on mouse hover
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const radius = size / 2;
  const center = radius;

  // Generate 60 minute / hour ticks
  const ticks = Array.from({ length: 60 }).map((_, i) => {
    const angle = (i * 6) * (Math.PI / 180);
    const isHour = i % 5 === 0;
    const innerDist = isHour ? radius * 0.76 : radius * 0.84;
    const outerDist = radius * 0.88;

    const x1 = center + Math.sin(angle) * innerDist;
    const y1 = center - Math.cos(angle) * innerDist;
    const x2 = center + Math.sin(angle) * outerDist;
    const y2 = center - Math.cos(angle) * outerDist;

    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isHour ? 'var(--text-primary)' : 'var(--clock-ticks)'}
        strokeWidth={isHour ? (size > 200 ? 3 : 2) : 1}
        strokeLinecap="round"
        opacity={isHour ? 0.9 : 0.4}
      />
    );
  });

  // Generate numbers for 12 hours
  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
    const angle = (num * 30) * (Math.PI / 180);
    const dist = radius * 0.65;
    const x = center + Math.sin(angle) * dist;
    const y = center - Math.cos(angle) * dist + 4;

    return (
      <text
        key={num}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--text-primary)"
        fontSize={size > 250 ? 14 : 11}
        fontWeight={700}
        fontFamily="var(--font-heading)"
        style={{ userSelect: 'none', opacity: 0.85 }}
      >
        {num}
      </text>
    );
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        transform: `perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease-out',
        margin: '0 auto',
      }}
    >
      {/* Outer Ambient Glow Ring */}
      <div
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          opacity: 0.25,
          filter: 'blur(8px)',
          zIndex: 0,
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '50%',
          background: 'var(--clock-face-bg)',
          border: '2px solid var(--clock-border)',
          boxShadow: 'var(--shadow-lg), inset 0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Ticks */}
        {ticks}

        {/* Hour Numbers for Chrono & Classic */}
        {(faceStyle === 'chrono' || faceStyle === 'classic') && numbers}

        {/* Subdials for Chrono style */}
        {showSubdials && faceStyle === 'chrono' && size >= 220 && (
          <>
            {/* Top Subdial: AM/PM */}
            <g transform={`translate(${center}, ${center - radius * 0.35})`}>
              <circle r={radius * 0.18} fill="rgba(0,0,0,0.25)" stroke="var(--clock-border)" strokeWidth="1" />
              <text y={3} textAnchor="middle" fill="var(--accent-color)" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
                {hours >= 12 ? 'PM' : 'AM'}
              </text>
            </g>

            {/* Date Window Badge */}
            <g transform={`translate(${center + radius * 0.42}, ${center})`}>
              <rect x="-14" y="-10" width="28" height="20" rx="4" fill="var(--bg-secondary)" stroke="var(--clock-border)" />
              <text y={3} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
                {day}
              </text>
            </g>
          </>
        )}

        {/* City Label inside face */}
        {city && (
          <text
            x={center}
            y={center + radius * (faceStyle === 'minimal' ? 0.35 : 0.45)}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={size > 220 ? 11 : 9}
            fontWeight="600"
            letterSpacing="0.08em"
            style={{ textTransform: 'uppercase' }}
          >
            {city}
          </text>
        )}

        {/* Hour Hand */}
        <line
          x1={center}
          y1={center}
          x2={center + Math.sin(hourAngle * Math.PI / 180) * (radius * 0.5)}
          y2={center - Math.cos(hourAngle * Math.PI / 180) * (radius * 0.5)}
          stroke="var(--hand-hour)"
          strokeWidth={size > 220 ? 6 : 4}
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0px 3px 4px rgba(0,0,0,0.6))',
          }}
        />

        {/* Minute Hand */}
        <line
          x1={center}
          y1={center}
          x2={center + Math.sin(minAngle * Math.PI / 180) * (radius * 0.72)}
          y2={center - Math.cos(minAngle * Math.PI / 180) * (radius * 0.72)}
          stroke="var(--hand-minute)"
          strokeWidth={size > 220 ? 4 : 3}
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.6))',
          }}
        />

        {/* Second Hand */}
        <g style={{ transformOrigin: `${center}px ${center}px`, transform: `rotate(${secAngle}deg)` }}>
          <line
            x1={center}
            y1={center + radius * 0.15}
            x2={center}
            y2={center - radius * 0.82}
            stroke="var(--accent-color)"
            strokeWidth={size > 220 ? 2 : 1.5}
            strokeLinecap="round"
          />
          {/* Second Hand Counterbalance circle */}
          <circle
            cx={center}
            cy={center + radius * 0.15}
            r={size > 220 ? 4 : 3}
            fill="var(--accent-color)"
          />
        </g>

        {/* Center Cap */}
        <circle cx={center} cy={center} r={size > 220 ? 6 : 4} fill="var(--accent-color)" />
        <circle cx={center} cy={center} r={size > 220 ? 2.5 : 2} fill="#ffffff" />
      </svg>
    </div>
  );
}
