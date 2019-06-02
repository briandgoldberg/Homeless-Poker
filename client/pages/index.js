/* eslint-disable react/style-prop-object */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import Web3 from 'utils/web3'
import Link from 'next/link'

import { Button, Container } from 'components'
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
    return (
      <>
        <Container>
          <h1>Homeless Poker: No need for a house </h1>
          <p>
            Distribute poker tournament earnings without a “house” or middleman
            using blockchain technology.
          </p>
          <Link href="/create">
            <a>
              <Button title="Create a room" />
            </a>
          </Link>
          {' '}
          <Link href="/join">
            <a>
              <Button title="Join a room" />
            </a>
          </Link>
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
