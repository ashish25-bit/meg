import runBtn from '../../assets/run.svg';
import { useEditor } from '../../utils/EditorProvider';
import BtnTitle from '../BtnTitle';
import { ButtonProp } from '../../utils/ButtonProp';

const RunBtn = ({ width }: ButtonProp) => {

  const { run } = useEditor();

  const clickHandler = (): void => run();

  return (
    <BtnTitle title="Alt + Enter">
      <button data-test='run' onClick={() => clickHandler()}>
        <img style={{ width: width }} src={runBtn} alt="Run" />
      </button>
    </BtnTitle>
  )
}

export default RunBtn;

