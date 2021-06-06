import { useEditor } from '../utils/EditorProvider';

const Gutter = () => {
  const { lines, currentLine } = useEditor();

  return (
    <div className="gutter">
      {
        [...Array(lines).keys()].map((_, index) => {
          return <div
            className={currentLine === index + 1 ? 'current-line dead-center' : `dead-center`}
            key={index}
          >{index + 1}</div>
        })
      }
    </div>
  )
}

export default Gutter;
