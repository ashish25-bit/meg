import React, { useContext, useEffect, useRef } from 'react';
import { EditorContext } from '../context/EditorContext';

const Editor: React.FC = () => {

  const editor = useRef<HTMLTextAreaElement>(null);

  const { setEditorData, run, editorData } = useContext(EditorContext);

  useEffect(() => {
    if (editor.current)
      editor.current.focus();
  } , []);
  
  const keyDownEvents = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    // run shortcut
    if (e.key === 'Enter' && e.altKey) run();

    // reset shortcut
    if ((e.key === 'x' || e.key === 'X') && e.altKey) setEditorData("")
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
          value={editorData}
          ref={editor}
          className="editor" 
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          onInput={e => setEditorData((editor.current?.value))}
          onKeyDown={e => keyDownEvents(e)}
        ></textarea>
      </div>
  )
}

export default Editor;
