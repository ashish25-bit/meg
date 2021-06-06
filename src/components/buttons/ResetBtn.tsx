import resetBtn from '../../assets/reset.svg';
import { useEditor } from '../../utils/EditorProvider';
import BtnTitle from '../BtnTitle';
import { ButtonProp } from '../../utils/ButtonProp';

const ResetBtn = ({ width }: ButtonProp) => {

  const { reset } = useEditor();
  
  const clickHandler = (): void => reset();

  return (
    <BtnTitle title="Alt + X">
      <button onClick={() => clickHandler()}>
        <img style={{ width: width }} src={resetBtn} alt="Reset" />
      </button>
    </BtnTitle>
  )
}

export default ResetBtn;
