import React, { useContext, useRef, useState } from 'react';
import { EditorContext } from '../utils/EditorContext';
import Gutter from './Gutter';
import { KeyboardEvent } from '../utils/KeyboardEvent';

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

    // Enter
    else if (e.key === KeyboardEvent.ENTER) {
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

    // for removing line when backspace is clicked and input is empty
    else if (e.code === KeyboardEvent.BACKSPACE && editorData === '') {
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

    // adding tab space when tab key is clicked
    else if (e.code === KeyboardEvent.TAB) {
      e.preventDefault();
      const newEditorData = `${editorData}\t`;
      setEditorData(newEditorData);
    }

    // going down when down key is clicked
    else if (e.code === KeyboardEvent.UP) {
      e.preventDefault();
      if (lines > 1 && currentLine > 1) {
        
        if (editorData !== lineData[currentLine - 1]) {
          let newArray = [...lineData];
          newArray[currentLine - 1] = editorData;
          setLineData(newArray);
        }

        setEditorData(lineData[currentLine - 2]);
        setCurrentLine(prevState => prevState - 1);
      }
    }

    // going down when down key is clicked
    else if (e.code === KeyboardEvent.DOWN) {
      e.preventDefault();
      if (currentLine < lines) {
        if (lineData[currentLine - 1] !== editorData) {
          let newArray = [...lineData];
          newArray[currentLine - 1] = editorData;
          setLineData(newArray)
        }
        setEditorData(lineData[currentLine]);
        setCurrentLine(prevState => prevState + 1); 
      }
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
    setCurrentLine(lineIndex + 1);
    inputRef.current?.focus();
  }

  return (
    // document.documentElement.style.setProperty('--your-variable', '#YOURCOLOR');
    <div className="editorContainer">
      <Gutter lines={lines} currentLine={currentLine} />

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
