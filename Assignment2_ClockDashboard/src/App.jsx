import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import AnalogClock from './components/AnalogClock';
import DigitalClock from './components/DigitalClock';
import WorldClockGrid from './components/WorldClockGrid';
import TimeConverter from './components/TimeConverter';
import AlarmManager from './components/AlarmManager';
import AlarmModal from './components/AlarmModal';
import StopwatchTimer from './components/StopwatchTimer';
import FocusView from './components/FocusView';
import SettingsModal from './components/SettingsModal';
import { useClock } from './hooks/useClock';
import { playTickSound } from './utils/audio';
import { POPULAR_CITIES, getTimeInZone } from './utils/timezones';

export default function App() {
  // Real-time clock tick hook (~20fps)
  const date = useClock(50);

  // Cities State
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('timespot_cities');
    return saved ? JSON.parse(saved) : [
      POPULAR_CITIES[2], // Los Angeles (UTC-8)
      POPULAR_CITIES[1], // New York (UTC-5)
      POPULAR_CITIES[0], // London (UTC+0)
      POPULAR_CITIES[4], // Paris (UTC+1)
      POPULAR_CITIES[3], // Tokyo (UTC+9)
    ];
  });

  const [primaryCity, setPrimaryCity] = useState(cities[2] || POPULAR_CITIES[0]); // Default London / LA

  // Alarms State
  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem('timespot_alarms');
    return saved ? JSON.parse(saved) : [
      {
        id: 'default-1',
        title: 'Morning Sync',
        hours: 8,
        minutes: 15,
        category: 'work',
        sound: 'digital_beep',
        snoozeMinutes: 5,
        days: [1, 2, 3, 4, 5],
        enabled: true,
        lastTriggered: null
      }
    ];
  });

  // Controls & Preferences State
  const [activeView, setActiveView] = useState('grid'); // 'grid' | 'analog' | 'converter' | 'stopwatch' | 'focus'
  const [is24Hour, setIs24Hour] = useState(true); // Default 24h as in screenshot
  const [theme, setTheme] = useState('light'); // Default Light minimalist theme as in reference UI
  const [accentColor, setAccentColor] = useState({ id: 'dark', label: 'Dark', value: '#09090b', rgb: '9, 9, 11' });
  const [faceStyle, setFaceStyle] = useState('chrono');
  const [isSweeping, setIsSweeping] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddAlarmOpen, setIsAddAlarmOpen] = useState(false);
  const [ringingAlarm, setRingingAlarm] = useState(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('timespot_cities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    localStorage.setItem('timespot_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Dynamic Browser Tab Title Update with Live Clock
  useEffect(() => {
    if (!primaryCity) return;
    const info = getTimeInZone(date, primaryCity.timezone);
    const timeStr = is24Hour ? info.formattedTime24 : info.formattedTime12;
    document.title = `${timeStr} (${primaryCity.city}) | TimeSpot`;
  }, [date, primaryCity, is24Hour]);

  // Alarm Monitor Check Loop
  const lastCheckedMin = useRef(-1);
  useEffect(() => {
    const currentMin = date.getMinutes();
    if (currentMin !== lastCheckedMin.current) {
      lastCheckedMin.current = currentMin;

      const nowH = date.getHours();
      const nowM = date.getMinutes();
      const nowDay = date.getDay();

      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.hours === nowH && alarm.minutes === nowM) {
          if (alarm.days.includes(nowDay)) {
            setRingingAlarm(alarm);
          }
        }
      });
    }
  }, [date, alarms]);

  // Handlers for City Management
  const handleAddCity = (city) => {
    if (!cities.some(c => c.id === city.id)) {
      setCities([...cities, city]);
    }
  };

  const handleRemoveCity = (cityId) => {
    const remaining = cities.filter(c => c.id !== cityId);
    setCities(remaining);
    if (primaryCity.id === cityId && remaining.length > 0) {
      setPrimaryCity(remaining[0]);
    }
  };

  // Handlers for Alarms
  const handleAddAlarm = (newAlarm) => {
    setAlarms([...alarms, newAlarm]);
  };

  const handleToggleAlarm = (id) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const handleDeleteAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const handleSnoozeAlarm = (id, snoozeMins) => {
    setRingingAlarm(null);
    const snoozeTime = new Date(Date.now() + snoozeMins * 60 * 1000);
    const snoozedAlarm = {
      id: `snooze-${Date.now()}`,
      title: `${ringingAlarm?.title || 'Alarm'} (Snoozed)`,
      hours: snoozeTime.getHours(),
      minutes: snoozeTime.getMinutes(),
      category: ringingAlarm?.category || 'personal',
      sound: ringingAlarm?.sound || 'digital_beep',
      snoozeMinutes: snoozeMins,
      days: [snoozeTime.getDay()],
      enabled: true
    };
    setAlarms([...alarms, snoozedAlarm]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Filter cities by search bar
  const displayedCities = searchQuery 
    ? cities.filter(c => c.city.toLowerCase().includes(searchQuery.toLowerCase()) || c.country.toLowerCase().includes(searchQuery.toLowerCase()))
    : cities;

  return (
    <div className="timespot-wrapper">
      
      {/* TimeSpot Navbar Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        is24Hour={is24Hour}
        setIs24Hour={setIs24Hour}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddAlarm={() => setIsAddAlarmOpen(true)}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        activeAlarmsCount={alarms.filter(a => a.enabled).length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Router */}
      <main>
        
        {/* DASHBOARD MAIN VIEW */}
        {activeView === 'grid' && (
          <div>
            
            {/* Giant Hero Digital Clock Display (Reference Image 1 & 2) */}
            <DigitalClock
              date={date}
              timezone={primaryCity.timezone}
              cityName={`${primaryCity.city}, ${primaryCity.country}`}
              is24Hour={is24Hour}
              showSeconds={true}
              onToggleFormat={() => setIs24Hour(!is24Hour)}
            />

            {/* World Clock Cards Grid */}
            <WorldClockGrid
              cities={displayedCities}
              primaryCity={primaryCity}
              setPrimaryCity={setPrimaryCity}
              onRemoveCity={handleRemoveCity}
              onAddCity={handleAddCity}
              onFocusCity={(city) => {
                setPrimaryCity(city);
                setActiveView('focus');
              }}
              date={date}
              is24Hour={is24Hour}
            />

          </div>
        )}

        {/* FOCUS VIEW */}
        {activeView === 'focus' && (
          <FocusView
            city={primaryCity}
            cities={cities}
            onSelectFocusCity={(c) => setPrimaryCity(c)}
            date={date}
            is24Hour={is24Hour}
            setIs24Hour={setIs24Hour}
            faceStyle={faceStyle}
            isSweeping={isSweeping}
          />
        )}

        {/* ANALOG CLOCK VIEW */}
        {activeView === 'analog' && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>
              Swiss Precision Analog Clock
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AnalogClock
                date={date}
                timezone={primaryCity.timezone}
                size={340}
                faceStyle={faceStyle}
                isSweeping={isSweeping}
                showSubdials={true}
                city={primaryCity.city}
              />
            </div>
          </div>
        )}

        {/* CONVERTER VIEW */}
        {activeView === 'converter' && (
          <TimeConverter
            cities={cities}
            date={date}
            is24Hour={is24Hour}
          />
        )}

        {/* STOPWATCH & TIMER VIEW */}
        {activeView === 'stopwatch' && (
          <StopwatchTimer />
        )}
      </main>

      {/* Ringing Alarm Overlay */}
      {ringingAlarm && (
        <AlarmModal
          alarm={ringingAlarm}
          onDismiss={() => setRingingAlarm(null)}
          onSnooze={handleSnoozeAlarm}
        />
      )}

      {/* Alarm Creation Drawer */}
      {isAddAlarmOpen && (
        <AlarmManager
          alarms={alarms}
          onAddAlarm={handleAddAlarm}
          onToggleAlarm={handleToggleAlarm}
          onDeleteAlarm={handleDeleteAlarm}
          date={date}
          isModalOpen={isAddAlarmOpen}
          setIsModalOpen={setIsAddAlarmOpen}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        faceStyle={faceStyle}
        setFaceStyle={setFaceStyle}
        isSweeping={isSweeping}
        setIsSweeping={setIsSweeping}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        volume={volume}
        setVolume={setVolume}
      />

    </div>
  );
}
