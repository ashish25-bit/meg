import React, { Fragment } from 'react';
import './App.css';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import Sample from './components/Sample';

const App: React.FC = () => {
  return (
    <Fragment>
      <Header />
      <MainContainer />
      <Sample />
    </Fragment>
  );
}

export default App;

