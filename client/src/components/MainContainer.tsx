import React, { useState } from 'react';
import ButtonContainer from './ButtonContainer';
import Editor from './Editor';
import Output from './Output';
import { EditorContext } from '../utils/EditorContext';
import { expressionEvaluator } from '../compiler/EpressionEvaluator';

const MainContainer: React.FC = () =>  {

  const [editorData, setEditorData] = useState("");
  const [outputData, setOutputData] = useState(null);

  const run = () => {
    if (!editorData.trim().length) {
      alert('No input data present');
      return
    }
    
    const data: any = expressionEvaluator(editorData.trim());
    console.log(data)
    setOutputData(data);
  }

  return (
    <EditorContext.Provider
      value={{
        setEditorData, 
        editorData,
        outputData,
        run,
        setOutputData
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
