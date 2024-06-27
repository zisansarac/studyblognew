// src/components/Controls.js
import React from 'react';
import { BsPlayFill, BsPauseFill, BsArrowRepeat } from 'react-icons/bs';

const Controls = ({ isActive, toggleTimer, resetTimer }) => {
  return (
    <div className="controls">
      {!isActive ? (
        <BsPlayFill className="control-icon" onClick={toggleTimer} />
      ) : (
        <BsPauseFill className="control-icon" onClick={toggleTimer} />
      )}
      <BsArrowRepeat className="control-icon" onClick={resetTimer} />
    </div>
  );
};

export default Controls;
