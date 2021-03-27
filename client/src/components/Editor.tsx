import React, { useEffect, useRef } from 'react';

const Editor: React.FC = () => {

  const editor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editor.current)
      editor.current.focus();
  } , []);

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
        <div 
          ref={editor}
          className="editor" 
          contentEditable={true}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        ></div>
      </div>
  )
}

export default Editor;
