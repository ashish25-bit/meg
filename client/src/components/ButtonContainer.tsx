import RunBtn from './buttons/RunBtn';
import ResetBtn from './buttons/ResetBtn';

const ButtonContainer = () => {
  return (
    <div className="buttonContainer">
      <RunBtn width="80px" />
      <ResetBtn width="96px" />
    </div>
  )
}

export default ButtonContainer;
