import React, { Component, Fragment } from 'react';
import { Header, Segment } from '@stardust-ui/react';
import './EarnPoints.css';
// import UsePoints from './components/UsePoints';

class EarnPoints extends Component {
  render() {
    return (
      <Fragment>
        <Header as="h2" content="Plz buy one of these packages" />
        <div className="earn-points">
          <Segment className="item">Lol</Segment>
          <Segment className="item">Lol</Segment>
          <Segment className="item">Lol</Segment>
          <Segment className="item">Lol</Segment>
        </div>
      </Fragment>
    );
  }
}

export default EarnPoints;
