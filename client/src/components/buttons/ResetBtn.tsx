import { useContext } from 'react';
import resetBtn from '../../assets/reset.svg';
import { EditorContext } from '../../utils/EditorContext';
import BtnTitle from '../BtnTitle';
import { ButtonProp } from '../../utils/ButtonProp';

const ResetBtn = ({ width }: ButtonProp) => {

  const { setEditorData, setOutputData } = useContext(EditorContext);
  
  const clickHandler = (): void => {
    setEditorData('');
    setOutputData(null);
  }

  return (
    <BtnTitle title="Alt + X">
      <button onClick={() => clickHandler()}>
        <img style={{ width: width }} src={resetBtn} alt="Reset" />
      </button>
    </BtnTitle>
  )
}

export default ResetBtn;
