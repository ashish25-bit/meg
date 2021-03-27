import React, { useContext } from 'react';
import { EditorContext } from '../context/EditorContext';

const Output: React.FC = () => {
  const { outputData } = useContext(EditorContext);
  
  return (
      <div className="outputContainer">
        {outputData.length ? outputData : 'Output'}
      </div>
  )
}

export default Output;
