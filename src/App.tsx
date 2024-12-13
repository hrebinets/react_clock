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
  clockName: string;
  today: string;
};

export class App extends React.Component<{}, State> {
  state: State = {
    hasClock: true,
    clockName: 'Clock-0',
    today: getCurrentTime(),
  };

  timerId: number | null = null;

  timePerSecond: number | null = null;

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

    this.startTimers();
  }

  componentDidUpdate(prevState: Readonly<State>): void {
    if (prevState.hasClock !== this.state.hasClock) {
      if (this.state.hasClock) {
        this.startTimers();
      } else {
        this.clearTimers();
      }
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('contextmenu', this.hideClock);
    document.removeEventListener('click', this.showClock);

    this.clearTimers();
  }

  startTimers = () => {
    this.clearTimers();

    this.timerId = window.setInterval(() => {
      this.setState(prevState => {
        const newName = getRandomName();
        const prevName = prevState.clockName;

        // eslint-disable-next-line no-console
        console.warn(`Renamed from ${prevName} to ${newName}`);

        return { clockName: newName };
      });
    }, 3300);

    this.timePerSecond = window.setInterval(() => {
      const currentTime = getCurrentTime();

      this.setState({ today: currentTime });
      // eslint-disable-next-line no-console
      console.log(currentTime);
    }, 1000);
  };

  clearTimers = () => {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    if (this.timePerSecond !== null) {
      window.clearInterval(this.timePerSecond);
      this.timePerSecond = null;
    }
  };

  render() {
    const { hasClock, clockName, today } = this.state;

    return (
      <div className="App">
        <h1>React Clock</h1>
        {hasClock && (
          <div className="Clock">
            <strong className="Clock__name">{clockName}</strong>
            {' time is '}
            <span className="Clock__time">{today}</span>
          </div>
        )}
      </div>
    );
  }
}
