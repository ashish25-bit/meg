import React, { useState } from 'react';
import ButtonContainer from './ButtonContainer';
import Editor from './Editor';
import Output from './Output';
import { EditorContext } from '../utils/EditorContext';
import { mainEvaluator } from '../compiler/MainEvaluator';

const MainContainer: React.FC = () =>  {

  const [lines, setLines] = useState(1);
  const [currentLine, setCurrentLine] = useState(1);
  const [lineData, setLineData] = useState(Array<string>(""));
  const [outputData, setOutputData] = useState(null);

  const run = () => {
    const data: any = mainEvaluator(lineData);
    console.log(data)
    setOutputData(data);
  }

  return (
    <EditorContext.Provider
      value={{
        outputData, setOutputData,
        run,
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
