import React, { useContext, useRef, useState } from 'react';
import { EditorContext } from '../utils/EditorContext';
import Gutter from './Gutter';

const Editor: React.FC = () => {

  const inputRef = useRef<HTMLInputElement>(null);
  const [lines, setLines] = useState(1);
  const [currentLine, setCurrentLine] = useState(1);
  const [lineData, setLineData] = useState(Array<string>());
  const lineRef = useRef(Array<HTMLDivElement>());
  lineRef.current = Array<HTMLDivElement>();

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
      setLines(prevState => prevState + 1);
      setCurrentLine(prevState => prevState + 1);
      setLineData(prevData => [...prevData, `__ ${editorData}`]);
      setEditorData("");
    }
  }

  function clickOnLine(lineIndex: number): void {
    setEditorData(lineData[lineIndex]);
    setCurrentLine(lineIndex+1)
  }

  function assignRef(el: HTMLDivElement) {
    if (el) {
      lineRef.current.push(el);
    }
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
        />
        {
          new Array(lines).fill(0).map((_, i) => (
            <div
              className={i + 1 === currentLine ?
                'current-line editor-line' :
                'editor-line'}
              key={i}
              onClick={() => clickOnLine(i)}
              ref={assignRef}
            >
              {i + 1 === currentLine ? "" : lineData[i]}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Editor;
