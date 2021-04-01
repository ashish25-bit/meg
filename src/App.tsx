import React, { Fragment } from 'react';
import './App.css';
import Header from './components/Header';
import MainContainer from './components/MainContainer';

const App: React.FC = () => {
  return (
    <Fragment>
      <Header />
      <MainContainer />
    </Fragment>
  );
}

export default App;

