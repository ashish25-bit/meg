import { createContext, useContext, useState } from "react";
import { mainEvaluator } from "../compiler/Main";

export const EditorContext = createContext<any>({});

interface Prop {
  children: React.ReactNode;
}

const EditorProvider = (props: Prop) => {

  const [lines, setLines] = useState(10);
  const [currentLine, setCurrentLine] = useState(10);
  const [lineData, setLineData] = useState<Array<string>>([
    "int a = 10",
    "int b = 20",
    "",
    "int temp = a",
    "a = b",
    "b = temp",
    "",
    "print(a)",
    "print(b)"
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
