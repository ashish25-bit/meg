import './App.css';
import runBtn from './assets/run.svg';

function App() {
  return (
    <div>
      <div className="header">
        <h1>meg.</h1>
      </div>
      <div className="mainContainer">
        
        <button className="runBtn">
          <img src={runBtn} alt="Run" />
        </button>

        <div className="wrapperContainer">

          <div className="editorContainer">
            <div className="editor">Editor</div>
          </div>

          <div className="outputContainer">Output</div>

        </div>

      </div>
    </div>
  );
}

export default App;
