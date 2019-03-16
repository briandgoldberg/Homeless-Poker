import React, { Component, Fragment } from 'react';
import { Layout } from '@stardust-ui/react';
// import './App.css';
import UsePoints from './components/UsePoints';
import EarnPoints from './components/EarnPoints';
import Registration from './components/Registration';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Layout
          debug
          reducing
          main={
            <Fragment>
              <Registration />
              <EarnPoints />
            </Fragment>
          }
          end={<UsePoints />}
        />
      </Fragment>
    );
  }
}

export default App;
