import React, { useContext } from 'react';
import { EditorContext } from '../utils/EditorContext';

const Output: React.FC = () => {
  const { outputData } = useContext(EditorContext);
  
  return (
      <div className="outputContainer">
        {
          !outputData ? 
            <div style={{ color: "#767676" }}>Output</div> :

            !outputData.error ? 
              <div>{outputData.data}</div> : 
              <div>{
                outputData.data.map((e:string | number, index: number) => {
                  return (
                    <div style={{ color: "#F74000" }} key={index}>{e}</div>
                  )
                })
              }</div>
        }
      </div>
  )
}

export default Output;
