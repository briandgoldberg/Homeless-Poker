/* eslint-disable react/style-prop-object */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import Web3 from 'utils/web3'
import Link from 'next/link'

import { ActionForm, Button, Container, Header, Input } from 'components'
import styles from '../styles/index.scss'

let web3
try {
  web3 = Web3()
} catch (err) {
  console.error(err)
}

class Index extends Component {
  render() {
    console.log(styles)
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    if (!web3.givenProvider) {
      return (
        <div>Found no Web3 provider, try installing the Metamask extension</div>
      )
    }
    return (
      <>
        <Container>
          <Header title="Homeless Poker" subtitle="No Need for a house">
            <p>What should we call you?</p>
            <Input
              className={styles.input_user}
              placeholder="Satoshison"
              label="Username"
              type="Username"
            />
          </Header>
          {/* TODO: Show error messages here if web3 not found */}
          <ActionForm type="Create" />
          <ActionForm type="Join" />
        </Container>
      </>
    )
  }
}

export default Index

Index.propTypes = {
  // eslint-disable-next-line react/require-default-props
  // classes: PropTypes.object
}
