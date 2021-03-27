import React, { useContext, useEffect, useRef } from 'react';
import { EditorContext } from '../context/EditorContext';

const Editor: React.FC = () => {

  const editor = useRef<HTMLTextAreaElement>(null);

  const { setEditorData, run } = useContext(EditorContext);

  useEffect(() => {
    if (editor.current)
      editor.current.focus();
  } , []);

  const captureInput = (_: React.KeyboardEvent<HTMLTextAreaElement>): void =>{
    setEditorData((editor.current?.value));
  }

  const keyDownEvents = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && e.altKey) run();
  }
  
  
  return (
      // document.documentElement.style.setProperty('--your-variable', '#YOURCOLOR');
      <div className="editorContainer">
        <div className="gutter">
          {
            new Array(1).fill(0).map((_, index) => {
              return <div key={index}>{index + 1}</div>
            })
          }
        </div>
        <textarea 
          ref={editor}
          className="editor" 
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          onKeyUp={e => captureInput(e)}
          onKeyDown={e => keyDownEvents(e)}
        ></textarea>
      </div>
  )
}

export default Editor;
