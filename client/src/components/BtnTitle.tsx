import { useState } from "react";

interface TitleProp {
  title: string;
  children: React.ReactNode;
}

const BtnTitle = (props: TitleProp) => {

  const [isTitleVisible, setIsTitleVisible] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsTitleVisible(true)}
      onMouseLeave={() => setIsTitleVisible(false)}
      style={{ position: "relative", display: 'inline-block' }}
    >
      {props.children}
      {isTitleVisible && <div className="btnTitle">{props.title}</div>}
    </div>
  )
}
export default BtnTitle;
