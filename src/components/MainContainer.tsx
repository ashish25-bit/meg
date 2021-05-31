import React, { useState } from 'react';
import ButtonContainer from './ButtonContainer';
import Editor from './Editor';
import Output from './Output';
import { EditorContext } from '../utils/EditorContext';
import { mainEvaluator } from '../compiler/Main';

const MainContainer: React.FC = () =>  {

  const [lines, setLines] = useState(5);
  const [currentLine, setCurrentLine] = useState(5);
  const [lineData, setLineData] = useState<Array<string>>([
    "a = 10",
    "{",
    "b = a * 10",
    "}"
  ]);
  const [outputData, setOutputData] = useState(null);

  const reset = () => {
    setOutputData(null);
    setLineData([]);
    setCurrentLine(1);
    setLines(1);
  }

  const run = () => {
    const data: any = mainEvaluator(lineData);
    setOutputData(data);
  }

  return (
    <EditorContext.Provider
      value={{
        outputData, setOutputData,
        run, reset,
        lines, setLines,
        currentLine, setCurrentLine,
        lineData, setLineData
      }}
    >
      <div className="mainContainer">

        <ButtonContainer />
        
        <div className="wrapperContainer">
          <Editor />
          <Output />
        </div>
        
      </div>
    </EditorContext.Provider>
  )
}

export default MainContainer;
