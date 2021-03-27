import React, { useContext } from 'react';
import runBtn from '../assets/run.svg';
import { EditorContext } from '../context/EditorContext';
import BtnTitle from './BtnTitle';


const RunBtn: React.FC = () => {

  const { run } = useContext(EditorContext);

  const clickHandler = (): void => run();

  return (
    <BtnTitle title="Alt + Enter">
      <button 
        onClick={() => clickHandler()} 
        className="runBtn"
      >
        <img src={runBtn} alt="Run" />
      </button>
    </BtnTitle>
  )
}

export default RunBtn;

