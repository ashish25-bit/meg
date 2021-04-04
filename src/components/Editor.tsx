import React, { useContext, useRef } from 'react';
import { EditorContext } from '../utils/EditorContext';
import Gutter from './Gutter';
import { KeyboardEvent } from '../utils/KeyboardEvent';

const Editor: React.FC = () => {

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    lines, setLines,
    currentLine, setCurrentLine,
    lineData, setLineData,
    run
  } = useContext(EditorContext);

  function setInputVal(str: string) {
    if (inputRef.current)
      inputRef.current.value = str;
  }

  function captureKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {

    // run command
    if (e.key === 'Enter' && e.altKey) {
      run();
      return;
    }

    // reset command
    if ((e.key === 'x' || e.key === 'X') && e.altKey) {
      setInputVal(" ");
      setLineData([]);
      setLines(1);
      setCurrentLine(1);
      return;
    }

    // Enter
    else if (e.key === KeyboardEvent.ENTER) {
      e.preventDefault();

      // console.log('Caret at: ', inputRef.current?.selectionStart)

      let newArray = [...lineData];
      newArray[currentLine - 1] = `${inputRef.current?.value} `;

      if (lines === currentLine)
        newArray.push("");
      else
        newArray.splice(currentLine, 0, "")

      setLineData(newArray);
      setLines((prevState: number) => prevState + 1);
      setCurrentLine((prevState: number) => prevState + 1);
      setInputVal("");
    }

    // for removing line when backspace is clicked and input is empty
    else if (e.code === KeyboardEvent.BACKSPACE && inputRef.current?.value === '') {
      let newArray = lineData.filter((_: any, index: number) =>
        currentLine !== index + 1
      )
      setLineData(newArray);

      if (currentLine !== 1) {
        setLines((prevData: number) => prevData - 1);
        setCurrentLine((prevData: number) => prevData - 1);
        setInputVal(newArray[currentLine - 2]);
      }
    }

    // adding tab space when tab key is clicked
    else if (e.code === KeyboardEvent.TAB) {
      e.preventDefault();
      const newEditorData = `${inputRef.current?.value}\t`;
      setInputVal(newEditorData);
    }

    // going down when up key is clicked
    else if (e.code === KeyboardEvent.UP) {
      e.preventDefault();
      if (lines > 1 && currentLine > 1) {

        if (inputRef.current?.value !== lineData[currentLine - 1]) {
          let newArray = [...lineData];
          newArray[currentLine - 1] = inputRef.current?.value;
          setLineData(newArray);
        }

        setInputVal(lineData[currentLine - 2]);
        setCurrentLine((prevState: number) => prevState - 1);
      }
    }

    // going down when down key is clicked
    else if (e.code === KeyboardEvent.DOWN) {
      e.preventDefault();
      if (currentLine < lines) {
        if (lineData[currentLine - 1] !== inputRef.current?.value) {
          let newArray = [...lineData];
          newArray[currentLine - 1] = inputRef.current?.value;
          setLineData(newArray)
        }
        setInputVal(lineData[currentLine]);
        setCurrentLine((prevState: number) => prevState + 1);
      }
    }
  }

  function onBlurEventCapture() {
    let newArray = [...lineData];
    newArray[currentLine - 1] = `${inputRef.current?.value} `;
    setLineData(newArray);
  }

  function clickOnLine(lineIndex: number): void {
    setInputVal(lineData[lineIndex]);
    setCurrentLine(lineIndex + 1);
    inputRef.current?.focus();
  }

  return (
    // document.documentElement.style.setProperty('--your-variable', '#YOURCOLOR');
    <div className="editorContainer">
      <Gutter lines={lines} currentLine={currentLine} />

      <div className="editor">
        <input
          className="editor-input"
          ref={inputRef}
          style={{ top: `${(currentLine - 1) * 26}px` }}
          onKeyDown={e => captureKeyDown(e)}
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
      {/* <button onClick={()/> => console.log(lineData)}>Click</button> */}
    </div>
  )
}

export default Editor;
