// src/components/TimerDisplay.js
import React from 'react';

const TimerDisplay = ({ workMinutes, breakMinutes, seconds, isBreak }) => {
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div className="timer">
      <span>{isBreak ? 'Break' : 'Work'}</span>
      <div className="time">
        {formatTime(workMinutes)}:{formatTime(seconds)}
      </div>
    </div>
  );
};

export default TimerDisplay;
