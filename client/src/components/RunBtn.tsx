import React from 'react';
import runBtn from '../assets/run.svg';

const RunBtn: React.FC = () => {
  return (
    <button className="runBtn">
      <img src={runBtn} alt="Run" />
    </button>
  )
}

export default RunBtn;
