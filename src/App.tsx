import React from 'react';
import './App.scss';

function getRandomName(): string {
  const value = Date.now().toString().slice(-4);

  return `Clock-${value}`;
}

function getCurrentTime(): string {
  return new Date().toUTCString().slice(-12, -4);
}

type State = {
  hasClock: boolean;
};

type StateClock = {
  clockName: string;
  today: string;
  timerId: number | null;
  timePerSecond: number | null;
};

class Clock extends React.Component<{}, StateClock> {
  state = {
    clockName: 'Clock-0',
    today: getCurrentTime(),
    timerId: null,
    timePerSecond: null,
  };

  componentDidMount(): void {
    const timerId = window.setInterval(() => {
      this.setState(prevState => {
        const newName = getRandomName();

        // eslint-disable-next-line no-console
        console.warn(`Renamed from ${prevState.clockName} to ${newName}`);

        return { clockName: newName };
      });
    }, 3300);

    const timePerSecond = window.setInterval(() => {
      const currentTime = getCurrentTime();

      this.setState({ today: currentTime });
      // eslint-disable-next-line no-console
      console.log(currentTime);
    }, 1000);

    this.setState({ timerId, timePerSecond });
  }

  componentWillUnmount(): void {
    if (this.state.timerId !== null) {
      window.clearInterval(this.state.timerId);
    }

    if (this.state.timePerSecond !== null) {
      window.clearInterval(this.state.timePerSecond);
    }
  }

  render(): React.ReactNode {
    const { clockName, today } = this.state;

    return (
      <div className="Clock">
        <strong className="Clock__name">{clockName}</strong>
        {' time is '}
        <span className="Clock__time">{today}</span>
      </div>
    );
  }
}

export class App extends React.Component<{}, State> {
  state: State = {
    hasClock: true,
  };

  hideClock = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ hasClock: false });
  };

  showClock = () => {
    this.setState({ hasClock: true });
  };

  componentDidMount(): void {
    document.addEventListener('contextmenu', this.hideClock);
    document.addEventListener('click', this.showClock);
  }

  componentWillUnmount(): void {
    document.removeEventListener('contextmenu', this.hideClock);
    document.removeEventListener('click', this.showClock);
  }

  render() {
    const { hasClock } = this.state;

    return (
      <div className="App">
        <h1>React Clock</h1>
        {hasClock && <Clock />}
      </div>
    );
  }
}
