import { useState, useEffect, useRef } from 'react';

export function useClock(updateIntervalMs = 50) {
  const [time, setTime] = useState(() => new Date());
  const requestRef = useRef();
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const updateTime = (timestamp) => {
      if (timestamp - lastUpdateRef.current >= updateIntervalMs) {
        setTime(new Date());
        lastUpdateRef.current = timestamp;
      }
      requestRef.current = requestAnimationFrame(updateTime);
    };

    requestRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [updateIntervalMs]);

  return time;
}
