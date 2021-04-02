interface Prop {
  lines: number;
  currentLine: number;
}

const Gutter = ({ lines, currentLine }: Prop) => {
  return (
    <div className="gutter">
      {
        new Array(lines).fill(0).map((_, index) => {
          return <div 
            className={currentLine === index + 1 ? 'current-line dead-center' :  `dead-center`} 
            key={index}
          >{index + 1}</div>
        })
      }
    </div>
  )
}

export default Gutter;
