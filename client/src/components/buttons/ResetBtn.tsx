import React, { useContext } from 'react';
import resetBtn from '../../assets/reset.svg';
import { EditorContext } from '../../context/EditorContext';
import BtnTitle from '../BtnTitle';
import { ButtonProp } from './ButtonProp';

const ResetBtn = ({ width }: ButtonProp) => {

  const { setEditorData } = useContext(EditorContext);
  const clickHandler = (): void => setEditorData('');

  return (
    <BtnTitle title="Alt + X">
      <button onClick={() => clickHandler()}>
        <img style={{ width: width }} src={resetBtn} alt="Reset" />
      </button>
    </BtnTitle>
  )
}

export default ResetBtn;
