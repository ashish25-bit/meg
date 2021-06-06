import { createContext, useContext, useState } from "react";
import { mainEvaluator } from "../compiler/Main";

export const EditorContext = createContext<any>({});

interface Prop {
  children: React.ReactNode;
}

const EditorProvider = (props: Prop) => {

  const [lines, setLines] = useState(14);
  const [currentLine, setCurrentLine] = useState(14);
  const [lineData, setLineData] = useState<Array<string>>([
    "a = 10",
    "{",
    "   b = a * 10",
    "   a = 22",
    "   {",
    "       c = a + b",
    "       b = c - a",
    "   }",
    "   {",
    "       d = b - a",
    "       a = d - b",
    "   }",
    "}"
  ]);
  const [outputData, setOutputData] = useState(null);

  const reset = () => {
    setOutputData(null);
    setLineData([]);
    setCurrentLine(1);
    setLines(1);
  }

  const run = () => {
    const data: any = mainEvaluator(lineData);
    setOutputData(data);
  }

  return (
    <EditorContext.Provider value={{
      outputData, setOutputData,
      run, reset,
      lines, setLines,
      currentLine, setCurrentLine,
      lineData, setLineData
    }}>
      {props.children}
    </EditorContext.Provider>
  )
}

const useEditor = () => useContext(EditorContext)

export { EditorProvider, useEditor };
