import React, { useEffect, useState } from 'react';
import './App.scss';

function getRandomName(): string {
  const value = Date.now().toString().slice(-4);

  return `Clock-${value}`;
}

export const App: React.FC = () => {
  const [hasClock, setHasClock] = useState(true);
  const [clockName, setClockName] = useState('Clock-0');
  const [today, setToday] = useState(new Date().toUTCString().slice(-12, -4));

  // #region Event Handlers
  const hideClock = (event: MouseEvent) => {
    event.preventDefault();
    setHasClock(false);
  };

  const showClock = () => {
    setHasClock(true);
  };

  useEffect(() => {
    document.addEventListener('contextmenu', hideClock);
    document.addEventListener('click', showClock);

    return () => {
      document.removeEventListener('contextmenu', hideClock);
      document.removeEventListener('click', showClock);
    };
  }, []);
  // #endregion

  useEffect(() => {
    setToday(new Date().toUTCString().slice(-12, -4));
    let timerId: number | null = null;
    let timePerSecond: number | null = null;

    if (hasClock) {
      timerId = window.setInterval(() => {
        setClockName(prevName => {
          const newName = getRandomName();

          // eslint-disable-next-line no-console
          console.warn(`Renamed from ${prevName} to ${newName}`);

          return newName;
        });
      }, 3300);

      timePerSecond = window.setInterval(() => {
        const currentTime = new Date().toUTCString().slice(-12, -4);

        setToday(currentTime);

        // eslint-disable-next-line no-console
        console.log(currentTime);
      }, 1000);

      return () => {
        if (timerId !== null) {
          window.clearInterval(timerId);
        }

        if (timePerSecond !== null) {
          window.clearInterval(timePerSecond);
        }
      };
    }
  }, [hasClock]);

  return (
    <div className="App">
      <h1>React clock</h1>

      {hasClock && (
        <div className="Clock">
          <strong className="Clock__name">{clockName}</strong>

          {' time is '}

          <span className="Clock__time">{today}</span>
        </div>
      )}
    </div>
  );
};
