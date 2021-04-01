import React, { useRef, useState } from 'react';
import ButtonContainer from './ButtonContainer';
import Editor from './Editor';
import Output from './Output';
import { EditorContext } from '../utils/EditorContext';
import { expressionEvaluator } from '../compiler/ExpressionEvaluator';

const MainContainer: React.FC = () =>  {

  const [editorData, setEditorData] = useState("");
  const [outputData, setOutputData] = useState(null);
  const variables = useRef(new Map<string, number>());

  const run = () => {
    // if (!editorData.trim().length) {
    //   alert('No input data present');
    //   return
    // }
    
    const data: any = expressionEvaluator(editorData.trim(), variables.current);
    setOutputData(data);
    console.log(variables.current)
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
