import './App.css';
import React, {useState, useEffect} from 'react';
import beep from './resources/beep-06.mp3';

function App() {
  const [timer, setTimer] = useState(1500);
  const [breakTimer, setBreakTimer] = useState(600)
  const [breaks, setBreaks] = useState(5);
  const [session, setSession] = useState(25);
  const [isPaused, setIsPaused] = useState(true);
  const [onBreak, setOnBreak] = useState(false);

// This section is to manage the buttons
  const breakDecrement = () => {
    if (breaks === 1 || !isPaused) return
    setBreaks(breaks - 1);
  };

  const breakIncrement = () => {
    if (breaks === 60 || !isPaused) return;
    setBreaks(breaks + 1);
  };

  const sessionDecrement = () => {
    if (session === 1 || !isPaused) return;
    setSession(session - 1);
  };

  const sessionIncrement = () => {
    if (session === 60 || !isPaused) return;
    setSession(session + 1);
  };

  const reset = () => {
    setTimer(1500);
    setBreakTimer(300);
    setBreaks(5);
    setSession(25);
    setOnBreak(false);
    setIsPaused(true);
  }

  // To allow the time in the session box to display in minute and second format
  const displayTime = (a) => {
    const min = Math.floor(a / 60);
    const sec = Math.floor(a % 60);
    return (min<10 ? '0'+min : min) + ':' +(sec<10 ? '0'+sec : sec);  
  }

  // Controling the pause and continue function
  const paused = () => {
    setIsPaused(!isPaused)
  }

  // This controls the countdown timer for the session block.
  // We have an interval that runs every second to countdown the clock on the session timer
  // upon hitting zero we clear the clock and change from session to break
  useEffect(() => {
    let intervalId;
    if (isPaused === false && onBreak === false){
      const updateTimer = () => {
        if (timer < 0) {
          clearInterval(intervalId)
          setOnBreak(true)
          setBreakTimer(breaks * 60)
          return;
        }
        intervalId = setInterval(() => {
          setTimer(prev => prev - 1)
        }, 1000)
      }
      updateTimer();
    return () => clearInterval(intervalId)}
  }, [timer, isPaused, onBreak, breaks])


  // This controls the break interval timer very similar to the above timer
  useEffect(() => {
    let breakInterval;
    if (onBreak === true && isPaused === false) {
      
      const updateBreaks = () => {
        if (breakTimer < 0) {
          clearInterval(breakInterval);
          setOnBreak(false);
          setTimer(session * 60);
        };
        breakInterval = setInterval(() => {
          setBreakTimer(prev => prev - 1)
        }, 1000)
      }
      updateBreaks()
    }
    return () => clearInterval(breakInterval)
  }, [isPaused, breakTimer, onBreak, session])

  // This controls setting the timers to the respective times when we are adjusting them prior to the clock starting
  useEffect(() => {
    if (onBreak === false){
    setTimer(session * 60)}
    setBreakTimer(breaks * 60);
  }, [session, breaks, onBreak])
  


  return (
    <div className="App">
      <main>
        <div id='heading'><h1>Pomodoro Timer</h1></div>
        <div id="break-label" 
        // style={!isPaused ? {visibility: 'hidden'} : {visibilty: 'visible'}}
        >
            <p>Break length</p>
            <p id="break-length">{breaks} min</p>
            <button id="break-decrement" onClick={breakDecrement}>Down</button>
            <button id="break-increment" onClick={breakIncrement}>Up</button>
        </div>
        <div id="session-label"
          // style={!isPaused ? {visibility: 'hidden'} : {visibilty: 'visible'}}
        >
            <p>Session length</p>
            <p id="'session-length">{session} min</p>
            <button id="session-decrement" onClick={sessionDecrement}>Down</button>
            <button id="session-increment" onClick={sessionIncrement}>Up</button>
        </div>
        <div className='timer'>
            <p id="timer-label">{onBreak ? 'Break' : 'Session'} {isPaused ? '' : 'Started'}</p>
            <p id="time-left">{onBreak === false ? displayTime(timer) : displayTime(breakTimer)}</p>
        </div>
        <div>
            <button className='start-reset' id="start_stop" onClick={paused} >{isPaused ? 'Start' : 'Stop'}</button>
            <button className='start-reset' id="reset" onClick={reset}>Reset</button>
        </div>
        <div>
          {timer === 0 ? <audio src={beep} autoPlay /> : <p></p>}
          {breakTimer === 0 ? <audio src={beep} autoPlay /> : <p></p>}
          
        </div>
    </main>
    </div>
  );
}

export default App;
