import React, { Fragment } from 'react';
import { useEditor } from '../utils/EditorProvider';

const Output: React.FC = () => {
  const { outputData } = useEditor();

  return (
    <div className="outputContainer">
      {
        !outputData ?
          <div style={{ color: "#767676" }}>Output</div> :

          !outputData.error ?
            <pre className='output-no-error'>{outputData.data}</pre> :
            <Fragment>
              <div style={{ color: "#F74000", fontStyle: 'italic' }}>Error at line: {outputData.lineNumber + 1}</div>
              <div>{
                outputData.data.map((message: string | number, index: number) => {
                  return (
                    <div style={{ color: "#F74000" }} key={index}>{message}</div>
                  )
                })
              }</div>
            </Fragment>
      }
    </div>
  )
}

export default Output;
