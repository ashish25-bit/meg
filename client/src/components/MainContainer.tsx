import React, { useState } from 'react';
import ButtonContainer from './ButtonContainer';
import Editor from './Editor';
import Output from './Output';
import { EditorContext } from '../context/EditorContext';

const MainContainer: React.FC = () =>  {

  const [editorData, setEditorData] = useState("");
  const [outputData, setOutputData] = useState("");

  const run = () => {
    setOutputData(editorData);
    if (!editorData.trim().length) {
      alert('No input data present');
      return
    }
  }

  return (
    <EditorContext.Provider
      value={{
        setEditorData, 
        editorData,
        outputData,
        run
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
