interface Prop {
  lines: number;
}

const Gutter = ({ lines }: Prop) => {
  return (
    <div className="gutter">
      {
        new Array(lines).fill(0).map((_, index) => {
          return <div className="dead-center" key={index}>{index + 1}</div>
        })
      }
    </div>
  )
}

export default Gutter;
