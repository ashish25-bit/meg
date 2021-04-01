import React, { useContext, useRef, useState } from 'react';
import { EditorContext } from '../utils/EditorContext';
import Gutter from './Gutter';

const Editor: React.FC = () => {

  const inputRef = useRef<HTMLInputElement>(null);
  const [lines, setLines] = useState(1);
  const [currentLine, setCurrentLine] = useState(1);
  const [lineData, setLineData] = useState([""]);

  const { setEditorData, run, editorData } = useContext(EditorContext);

  function captureKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {

    // run command
    // if (e.key === 'Enter' && e.altKey) {
    //   run();
    //   return;
    // }

    // reset command
    if ((e.key === 'x' || e.key === 'X') && e.altKey) {
      setEditorData("");
      setLineData([]);
      setLines(1);
      setCurrentLine(1);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      run();

      let newArray = [...lineData];
      newArray[currentLine - 1] = `${editorData} `;
      
      if (lines === currentLine)
        newArray.push("");
      else
        newArray.splice(currentLine, 0, "")
      
      setLineData(newArray);
      setLines(prevState => prevState + 1);
      setCurrentLine(prevState => prevState + 1);
      setEditorData("");
    }

    if (e.code === 'Backspace' && editorData === '') {
      let newArray = lineData.filter((_, index) =>
        currentLine !== index + 1
      )
      setLineData(newArray);

      if (currentLine !== 1) {
        setLines(prevData => prevData - 1);
        setCurrentLine(prevData => prevData - 1);
        setEditorData(newArray[currentLine - 2]);
      }
    }

    if (e.code === 'Tab') {
      e.preventDefault();
      const newEditorData = `${editorData}\t`;
      setEditorData(newEditorData);
    }

  }

  function onBlurEventCapture() {
    let newArray = [...lineData];
    newArray[currentLine - 1] = `${editorData} `;
    setLineData(newArray);
  }

  function clickOnLine(lineIndex: number): void {
    setEditorData(
      lineData[lineIndex] === undefined ? 
        "" : 
        lineData[lineIndex]
    );
    setCurrentLine(lineIndex+1);
    inputRef.current?.focus();
  }

  return (
    // document.documentElement.style.setProperty('--your-variable', '#YOURCOLOR');
    <div className="editorContainer">
      <Gutter lines={lines} />

      <div className="editor">
        <input
          value={editorData}
          className="editor-input"
          ref={inputRef}
          style={{ top: `${(currentLine - 1) * 26}px` }}
          onKeyDown={e => captureKeyDown(e)}
          onInput={e => setEditorData(inputRef.current?.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          autoFocus={true}
          onBlur={() => onBlurEventCapture()}
        />
        {
          new Array(lines).fill(0).map((_, i) => (
            <pre
              className={i + 1 === currentLine ?
                'current-line editor-line' :
                'editor-line'}
              key={i}
              onClick={() => clickOnLine(i)}
            >
              {i + 1 === currentLine ? "" : lineData[i]}
            </pre>
          ))
        }
      </div>
      {/* <button onClick={() => console.log(lineData)}>Click</button> */}
    </div>
  )
}

export default Editor;
