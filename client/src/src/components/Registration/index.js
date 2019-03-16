import React, { Component, Fragment } from 'react';
import { Button, Header, Input } from '@stardust-ui/react';

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }
  handleSubmit(e) {
    // do something with the input
    console.log(this.state.value);
  }
  render() {
    return (
      <Fragment>
        <Header as="h1" content="Register here:" />
        <Input onChange={this.handleChange} />
        <Button onClick={this.handleSubmit} />
      </Fragment>
    );
  }
}

export default Registration;
