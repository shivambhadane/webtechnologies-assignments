import React, { useState } from 'react';
import { getTimeInZone, getTimeDiffFromLocal, getUTCOffset, POPULAR_CITIES } from '../utils/timezones';
import { Plus, Trash2, Sun, Moon, Search, Check, Copy, Globe, Maximize2 } from 'lucide-react';

export default function WorldClockGrid({
  cities,
  onRemoveCity,
  onAddCity,
  onFocusCity,
  primaryCity,
  setPrimaryCity,
  date,
  is24Hour
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const tags = ['All', 'Americas', 'Europe', 'Asia', 'Middle East', 'Oceania', 'Africa'];

  const filteredCities = POPULAR_CITIES.filter(c => {
    const matchesSearch = c.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || c.tag === selectedTag;
    const notAlreadyAdded = !cities.some(item => item.id === c.id);
    return matchesSearch && matchesTag && notAlreadyAdded;
  });

  const handleCopyTime = (e, city) => {
    e.stopPropagation();
    const zoneInfo = getTimeInZone(date, city.timezone);
    const text = `${city.city}: ${is24Hour ? zoneInfo.formattedTime24 : zoneInfo.formattedTime12} (${zoneInfo.dateString})`;
    navigator.clipboard.writeText(text);
    setCopiedId(city.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeFocusCity = primaryCity || cities[0] || POPULAR_CITIES[0];

  return (
    <div style={{ marginTop: '24px' }}>
      
      {/* Primary City Headline & Add City Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        paddingTop: '24px',
        borderTop: '1px solid var(--card-border)'
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: 0,
            color: 'var(--text-primary)'
          }}>
            {activeFocusCity.city},
          </h2>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--text-secondary)'
          }}>
            {activeFocusCity.country}
          </h3>
        </div>

        {/* Inspiring Sub-quote */}
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          maxWidth: '280px',
          display: 'none',
          lineHeight: '1.4'
        }}>
          Life moves fast. Stay on time and enjoy every moment!
        </div>

        {/* Add Another City (+ Button) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            transition: 'opacity 0.2s ease'
          }}
        >
          <span>Add Another City</span>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '1.5px solid var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Plus size={14} strokeWidth={3} />
          </div>
        </button>
      </div>

      {/* Grid of City Cards (Matching Reference Layout) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {cities.map((c) => {
          const zoneInfo = getTimeInZone(date, c.timezone);
          const offset = getUTCOffset(c.timezone);
          const isSelected = activeFocusCity.id === c.id;

          // Card is Dark if it is Night OR if it's the selected active city
          const isCardDark = zoneInfo.isNight || isSelected;

          return (
            <div 
              key={c.id} 
              className={`timespot-city-card ${isCardDark ? 'card-dark' : ''} ${isSelected ? 'active-primary' : ''}`}
              onClick={() => {
                setPrimaryCity && setPrimaryCity(c);
                onFocusCity && onFocusCity(c);
              }}
            >
              {/* Card Top Row: City Name & UTC Offset */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>
                  <span className="card-city-name" style={{
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    letterSpacing: '-0.01em',
                    color: isCardDark ? '#ffffff' : 'var(--text-primary)'
                  }}>
                    {c.city}
                  </span>
                </div>

                <span className="card-utc-offset" style={{
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: isCardDark ? '#a1a1aa' : 'var(--text-muted)'
                }}>
                  {offset}
                </span>
              </div>

              {/* Card Bottom Row: Digital Time & Day/Night Pill */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div className="card-time-text" style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  fontVariantNumeric: 'tabular-nums',
                  color: isCardDark ? '#ffffff' : 'var(--text-primary)'
                }}>
                  {is24Hour ? zoneInfo.formattedTime24 : zoneInfo.formattedTime12.replace(/\s[AP]M/, '')}
                </div>

                {/* Day / Night Pill Badge */}
                <div className={zoneInfo.isNight ? 'badge-night' : 'badge-day'}>
                  {zoneInfo.isNight ? <Moon size={12} fill="#facc15" color="#facc15" /> : <Sun size={12} fill="#d97706" color="#d97706" />}
                  <span>{zoneInfo.isNight ? 'Night' : 'Day'}</span>
                </div>
              </div>

              {/* Remove Action Button on Hover */}
              {cities.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCity(c.id);
                  }}
                  title="Remove city"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: isCardDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    opacity: 0,
                    transition: 'opacity 0.2s ease'
                  }}
                  className="card-remove-btn"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                >
                  <Trash2 size={14} />
                </button>
              )}

            </div>
          );
        })}
      </div>

      <style>{`
        .timespot-city-card:hover .card-remove-btn {
          opacity: 1 !important;
        }
      `}</style>

      {/* Add City Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--container-bg)',
            border: '1px solid var(--container-border)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            padding: '28px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={22} style={{ color: 'var(--text-primary)' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                  Add World City
                </h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.6rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search city or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '10px 16px 10px 40px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
                autoFocus
              />
            </div>

            {/* Tag Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '14px' }}>
              {tags.map(t => (
                <button
                  key={t}
                  className={`pill-option ${selectedTag === t ? 'active' : ''}`}
                  onClick={() => setSelectedTag(t)}
                  style={{ fontSize: '0.75rem', padding: '4px 12px' }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Cities List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredCities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No matching cities found.
                </div>
              ) : (
                filteredCities.map(c => {
                  const offset = getUTCOffset(c.timezone);
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        onAddCity(c);
                        setIsAddModalOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '14px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.3rem' }}>{c.flag}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.city}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.country}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {offset}
                        </span>
                        <Plus size={16} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
