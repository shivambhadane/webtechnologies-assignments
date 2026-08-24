// Timezone Data and Helper Functions

export const POPULAR_CITIES = [
  { id: 'london', city: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧', tag: 'Europe' },
  { id: 'new-york', city: 'New York', country: 'United States', timezone: 'America/New_York', flag: '🇺🇸', tag: 'Americas' },
  { id: 'los-angeles', city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸', tag: 'Americas' },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', tag: 'Asia' },
  { id: 'paris', city: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', tag: 'Europe' },
  { id: 'sydney', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺', tag: 'Oceania' },
  { id: 'dubai', city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪', tag: 'Middle East' },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬', tag: 'Asia' },
  { id: 'mumbai', city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', tag: 'Asia' },
  { id: 'hong-kong', city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', flag: '🇭🇰', tag: 'Asia' },
  { id: 'berlin', city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪', tag: 'Europe' },
  { id: 'sao-paulo', city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', tag: 'Americas' },
  { id: 'cairo', city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬', tag: 'Africa' },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿', tag: 'Oceania' },
  { id: 'honolulu', city: 'Honolulu', country: 'United States', timezone: 'Pacific/Honolulu', flag: '🇺🇸', tag: 'Americas' },
  { id: 'utc', city: 'Coordinated Universal Time', country: 'Global', timezone: 'UTC', flag: '🌐', tag: 'Standard' },
  { id: 'toronto', city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦', tag: 'Americas' },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷', tag: 'Asia' },
  { id: 'bangkok', city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭', tag: 'Asia' },
  { id: 'istanbul', city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷', tag: 'Europe' },
];

/**
 * Gets local Date details for a given timezone
 */
export function getTimeInZone(date = new Date(), timezone = 'UTC') {
  try {
    const options = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
      hour12: false,
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);

    const map = {};
    parts.forEach(p => {
      map[p.type] = p.value;
    });

    const hours = parseInt(map.hour, 10) || 0;
    const minutes = parseInt(map.minute, 10) || 0;
    const seconds = parseInt(map.second, 10) || 0;
    const milliseconds = parseInt(map.fractionalSecondDigits, 10) || date.getMilliseconds();
    
    const year = parseInt(map.year, 10);
    const month = parseInt(map.month, 10);
    const day = parseInt(map.day, 10);

    // Reconstruct date object in zone context
    const zoneDate = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);

    // Calculate relative day/night
    const isNight = hours < 6 || hours >= 19;
    const isGoldenHour = (hours >= 6 && hours < 8) || (hours >= 17 && hours < 19);

    return {
      hours,
      minutes,
      seconds,
      milliseconds,
      year,
      month,
      day,
      isNight,
      isGoldenHour,
      formattedTime12: formatTime12(hours, minutes, seconds),
      formattedTime24: formatTime24(hours, minutes, seconds),
      dateString: formatDateString(date, timezone),
      dayName: new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'long' }).format(date),
      monthName: new Intl.DateTimeFormat('en-US', { timeZone: timezone, month: 'short' }).format(date),
    };
  } catch (e) {
    // Fallback if timezone is invalid
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return {
      hours: h,
      minutes: m,
      seconds: s,
      milliseconds: date.getMilliseconds(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      isNight: h < 6 || h >= 19,
      isGoldenHour: false,
      formattedTime12: formatTime12(h, m, s),
      formattedTime24: formatTime24(h, m, s),
      dateString: date.toDateString(),
      dayName: 'Today',
      monthName: '',
    };
  }
}

/**
 * Format 12 hour string (e.g. 09:41:05 AM)
 */
export function formatTime12(h, m, s, showSeconds = true) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const pad = num => String(num).padStart(2, '0');
  return `${pad(h12)}:${pad(m)}${showSeconds ? ':' + pad(s) : ''} ${ampm}`;
}

/**
 * Format 24 hour string (e.g. 14:41:05)
 */
export function formatTime24(h, m, s, showSeconds = true) {
  const pad = num => String(num).padStart(2, '0');
  return `${pad(h)}:${pad(m)}${showSeconds ? ':' + pad(s) : ''}`;
}

/**
 * Format friendly date
 */
export function formatDateString(date, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Calculate UTC offset label like "UTC+05:30" or "UTC-04:00"
 */
export function getUTCOffset(timezone) {
  try {
    const now = new Date();
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const diffMinutes = Math.round((tzDate - utcDate) / (1000 * 60));

    const sign = diffMinutes >= 0 ? '+' : '-';
    const absMinutes = Math.abs(diffMinutes);
    const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
    const mins = String(absMinutes % 60).padStart(2, '0');

    return `UTC${sign}${hours}:${mins}`;
  } catch (e) {
    return 'UTC';
  }
}

/**
 * Get difference in hours between a city timezone and user's local timezone
 */
export function getTimeDiffFromLocal(timezone) {
  try {
    const now = new Date();
    const cityTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const localTime = new Date(now.toLocaleString('en-US'));

    const diffHours = (cityTime - localTime) / (1000 * 60 * 60);
    const rounded = Math.round(diffHours * 2) / 2; // round to nearest 0.5

    if (rounded === 0) return 'Same time';
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded}h`;
  } catch (e) {
    return '';
  }
}
