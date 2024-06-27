// src/components/Pomodoro.js
import React, { useState, useEffect } from 'react';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import './Pomodoro.css'; // CSS for styling (optional)

const Pomodoro = () => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (workMinutes === 0 && breakMinutes === 0) {
            // Timer finished
            setIsActive(false);
            setIsBreak(false);
            setWorkMinutes(25);
            setBreakMinutes(5);
          } else if (workMinutes === 0) {
            // Work session finished, start break
            setIsBreak(true);
            setWorkMinutes(25);
            setSeconds(0);
          } else {
            // Decrease time by 1 minute
            setSeconds(59);
            if (isBreak) {
              setBreakMinutes(breakMinutes - 1);
            } else {
              setWorkMinutes(workMinutes - 1);
            }
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, workMinutes, breakMinutes, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setWorkMinutes(25);
    setBreakMinutes(5);
    setSeconds(0);
  };

  return (
    <div className="pomodoro">
      <TimerDisplay
        workMinutes={workMinutes}
        breakMinutes={breakMinutes}
        seconds={seconds}
        isBreak={isBreak}
      />
      <Controls
        isActive={isActive}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
      />
    </div>
  );
};

export default Pomodoro;
