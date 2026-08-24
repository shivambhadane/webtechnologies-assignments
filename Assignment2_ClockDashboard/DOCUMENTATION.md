# ACADEMIC PRACTICAL REPORT: PRACTICAL #2
## Advanced Real-Time Clock Dashboard Application using React

---

### 📋 PRACTICAL METADATA
- **Course Title**: Web Technologies
- **Practical Assignment**: Practical #2 (Minimum Six Series)
- **Topic**: Single Page Application Development with React, Hooks, SVG, and Web Audio API
- **Date**: August 2026

---

## 1. OBJECTIVE & SCOPE

The objective of Practical #2 is to architect and develop an advanced, highly responsive world-clock dashboard using **React**. The system integrates real-time analog/digital time displays, timezone management, custom alarm triggering mechanisms, and dynamic theme customizations.

---

## 2. SYSTEM ARCHITECTURE & STATE MANAGEMENT

The application follows a reactive component hierarchy:

```text
App.jsx (Root State & RAF Clock Tick Engine)
 ├── Navbar (Theme & View Router Controls)
 ├── AnalogClock (SVG Angle Math & Sweeping Hand Engine)
 ├── DigitalClock (Formatting & Millisecond Render Engine)
 ├── WorldClockGrid (Timezone Conversions & Search)
 ├── TimeConverter (24h Interactive Drag Slider)
 ├── AlarmManager (Alarm Creation & Trigger Monitor)
 ├── StopwatchTimer (High-Precision Split Lap Timer)
 └── SettingsModal (Custom Color Accents & Clock Face Styles)
```

---

## 3. CORE MATHEMATICAL FORMULAS (ANALOG HAND ANGLES)

For any given timestamp with hours ($H$), minutes ($M$), seconds ($S$), and milliseconds ($MS$):

### 1. Second Hand Angle ($\theta_{\text{sec}}$):
$$\theta_{\text{sec}} = (S + \frac{MS}{1000}) \times 6^\circ$$

### 2. Minute Hand Angle ($\theta_{\text{min}}$):
$$\theta_{\text{min}} = (M + \frac{S}{60}) \times 6^\circ$$

### 3. Hour Hand Angle ($\theta_{\text{hour}}$):
$$\theta_{\text{hour}} = ((H \pmod{12}) + \frac{M}{60} + \frac{S}{3600}) \times 30^\circ$$

---

## 4. CUSTOM REACT HOOK (`useClock.js`)

To achieve smooth 60fps sweeping hand movement without triggering unnecessary global re-renders:

```javascript
export function useClock(updateIntervalMs = 50) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let animFrameId;
    let lastUpdate = performance.now();

    const tick = (timestamp) => {
      if (timestamp - lastUpdate >= updateIntervalMs) {
        setNow(new Date());
        lastUpdate = timestamp;
      }
      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [updateIntervalMs]);

  return now;
}
```

---

## 5. EXPERIMENTAL VERIFICATION & FEATURE CHECKLIST

| Feature Component | Verification Method | Status |
|---|---|---|
| **Analog Sweeping Engine** | Smooth continuous movement vs discrete ticking mode toggle | PASS |
| **Digital 12h / 24h Sync** | Live format toggle across UTC and regional timezones | PASS |
| **Timezone Conversions** | Verified against Intl.DateTimeFormat timezone offsets | PASS |
| **Alarm Trigger System** | Automated minute check loop triggering web audio beep | PASS |
| **Theme Customizations** | Dynamic CSS variables for accent colors and glassmorphic panels | PASS |

---

## 6. CONCLUSION

Practical #2 successfully demonstrates state-of-the-art Web Application design principles using React, custom hooks, SVG mathematics, and interactive UI controls.
