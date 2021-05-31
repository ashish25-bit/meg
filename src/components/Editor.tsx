import React, { useContext, useRef, useState } from 'react';
import { EditorContext } from '../utils/EditorContext';
import Gutter from './Gutter';
import { KeyboardEventKeys } from '../utils/KeyboardEvent';

const Editor: React.FC = () => {
  
  const [inputVal, setInputVal] = useState<string>("");
  const [cursorLeft, setCursorLeft] = useState<Number>(10);

  const inputRef = useRef<HTMLInputElement>(null);
  const editorContaineRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const {
    lines, setLines,
    currentLine, setCurrentLine,
    lineData, setLineData,
    run, reset
  } = useContext(EditorContext);

  function captureKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {

    // run command
    if (e.key === KeyboardEventKeys.ENTER && e.altKey) {
      run();
      return;
    }

    // // reset command
    else if ((e.key === 'x' || e.key === 'X') && e.altKey) {
      reset();
      return;
    }

    // Enter
    else if (e.key === KeyboardEventKeys.ENTER) {
      e.preventDefault();

      if (currentLine >= 23)
        editorContaineRef.current?.scrollBy(0, 26);

      let newEditorData: string = "";
      let replaceValue: string = inputRef.current ? inputRef.current.value :  " ";
      
      let newArray: Array<string> = [...lineData];
      if (lines === currentLine)
        newArray.push("");
      else
        newArray.splice(currentLine, 0, "");

      let index1 = inputRef.current?.value.length;
      let index2 = inputRef.current?.selectionStart;
      
      if (index1 && index2 && index2 < index1 && inputRef.current) {
        replaceValue = inputRef.current?.value.substring(0, index2);
        newEditorData = inputRef.current?.value.substring(index2, index1);
      }

      newArray[currentLine - 1] = `${replaceValue} `;

      setLineData(newArray);
      setLines((prevState: number) => prevState + 1);
      setCurrentLine((prevState: number) => prevState + 1);
      setInputVal(newEditorData);
      setCursorLeft(10);
    }

    // for removing line when backspace and the cursor is at the end
    else if (e.key === KeyboardEventKeys.BACKSPACE && inputRef.current?.selectionStart === 0) {
      if (currentLine === 1) return;
      
      let currLineData = inputRef.current?.value + " ";
      let prevLineData = lineData[currentLine - 2];
      let newArray = [...lineData];
      newArray[currentLine - 2] = prevLineData + currLineData;
      newArray = newArray.filter((_: any, index: number) => currentLine !== index + 1)
        
      setLineData(newArray);

      setLines((prevData: number) => prevData - 1);
      setCurrentLine((prevData: number) => prevData - 1);
      setInputVal(prevLineData + currLineData);
    }

    // adding tab space when tab key is clicked
    else if (e.key === KeyboardEventKeys.TAB) {
      e.preventDefault();
      const newEditorData = `${inputRef.current?.value}\t`;
      setInputVal(newEditorData);
    }

    // going up when up key is clicked
    else if (e.key === KeyboardEventKeys.UP) {
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
    else if (e.key === KeyboardEventKeys.DOWN) {
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

  // function clickOnLine(lineIndex: number): void {
  function clickOnLine(lineIndex: number = -1): void {
    inputRef.current?.focus();

    if (lineIndex !== -1) {
      setInputVal(lineData[lineIndex]);
      setCurrentLine(lineIndex + 1);
      changeCursorPosition(lineData[lineIndex], lineData[lineIndex].length);
    }
  }

  function inputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(e.target.value)
    changeCursorPosition();
  }

  function changeCursorPosition(str: string = "", pos: number = -1) {
    let position: number | null;
    let replaceValue: string;

    if (pos === -1)
      position = inputRef.current ? inputRef.current.selectionStart : 0;
    else 
      position = pos;

    if (str !== "")
      replaceValue = str.substring(0, position ? position : 0);
    else 
      replaceValue = inputRef.current ? inputRef.current.value.substring(0, position ? position : 0) : "";

    if (spanRef.current)
      spanRef.current.innerText = replaceValue;

    setCursorLeft(10 + (spanRef.current ? spanRef.current.offsetWidth : 0));
  }

  function keyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === KeyboardEventKeys.TAB ||
      e.key === KeyboardEventKeys.ARROW_LEFT ||
      e.key === KeyboardEventKeys.ARROW_RIGHT
    )
      changeCursorPosition()
  }

  return (
    // document.documentElement.style.setProperty('--your-variable', '#YOURCOLOR');
    <div className="editorContainer" ref={editorContaineRef}>
      <Gutter lines={lines} currentLine={currentLine} />

      <span ref={spanRef} className="inputSpan"></span>
      <div className="editor">
        <input
          className="editor-input"
          ref={inputRef}
          onKeyDownCapture={e => captureKeyDown(e)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          autoFocus={true}
          value={inputVal}
          onChange={inputChange}
          onBlur={() => onBlurEventCapture()}
          onKeyUp={keyUp}
        />
        {
          new Array(lines).fill(0).map((_, i) => (
            i + 1 === currentLine ? 
              <div 
                className='editor-line current-line' 
                key={i}
                // style={{ top: `${(currentLine - 1) * 26}px` }}
                onClick={() => clickOnLine()}
              >
                <div
                  style={{
                    width: '0.5px',
                    height: '21px',
                    background: '#fff',
                    position: 'absolute',
                    left: `${cursorLeft}px`,
                    zIndex: 10000,
                    top: "50%",
                    transform: 'translateY(-50%)'
                  }}
                ></div>
                <pre>{inputVal}</pre>
              </div> : 
              <pre 
                key={i} className="editor-line"
                onClick={() => clickOnLine(i)}
              >
                {lineData[i]}
              </pre>

          ))
        }
      </div>
      {/* <button onClick={() => console.log(lineData)}>Click</button> */}
    </div>
  )
}

export default Editor;
