import React from 'react';
import ButtonContainer from './ButtonContainer';
import Editor from './Editor';
import Output from './Output';
import { EditorProvider } from '../utils/EditorProvider';

const MainContainer: React.FC = () =>  {
  return (
    <EditorProvider>
      <div className="mainContainer">
        <ButtonContainer />
        <div className="wrapperContainer">
          <Editor />
          <Output />
        </div>
      </div>
    </EditorProvider>
  )
}

export default MainContainer;
