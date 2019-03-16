import React, { Component, Fragment } from 'react';
import { List, Segment } from '@stardust-ui/react';
import './UsePoints.css';

class UsePoints extends Component {
  render() {
    const items = ['trip1', 'trip2', 'trip3'];
    return (
      <Fragment>
        <div className="use-points">
          <Segment>Lol</Segment>
          <Segment>Lol</Segment>
          <Segment>Lol</Segment>
          <Segment>Lol</Segment>
        </div>
      </Fragment>
    );
  }
}

export default UsePoints;
