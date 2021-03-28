import { useContext } from 'react';
import runBtn from '../../assets/run.svg';
import { EditorContext } from '../../context/EditorContext';
import BtnTitle from '../BtnTitle';
import { ButtonProp } from './ButtonProp';

const RunBtn = ({ width }: ButtonProp) => {

  const { run } = useContext(EditorContext);

  const clickHandler = (): void => run();

  return (
    <BtnTitle title="Alt + Enter">
      <button onClick={() => clickHandler()}>
        <img style={{ width: width }} src={runBtn} alt="Run" />
      </button>
    </BtnTitle>
  )
}

export default RunBtn;

