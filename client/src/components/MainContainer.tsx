import React from 'react';
import RunBtn from './RunBtn';
import Editor from './Editor';
import Output from './Output';

const MainContainer: React.FC = () =>  {
  return (
    <div className="mainContainer">
      <RunBtn />
      <div className="wrapperContainer">
        <Editor />
        <Output />
      </div>
    </div>
  )
}

export default MainContainer;
