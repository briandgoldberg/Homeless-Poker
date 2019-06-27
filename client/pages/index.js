/* eslint-disable react/style-prop-object */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import Web3 from 'utils/web3'
// import Link from 'next/link'

import { Container, Header, Panel } from 'components'
import styles from '../styles/index.scss'

let web3

class Index extends Component {
  componentWillMount () {
    // only fetch web3 on client side, because it depends on 'window'.
    try {
      web3 = Web3()
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    console.log(styles)
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <>
        <Container>
          <Header
            title="Header"
            subtitle="subtitle" 
          >
            <p>children</p>
          </Header>
          <Panel 
            action="Create"
            informationText="Lorem ipsum"
            informationType="ERROR"
            inputs={[
              {
                type: "buyin",
                placeholder: "0.0001",
                label: "Set buy-in amount"
              }, {
                type: "size",
                placeholder: "5",
                label: "Set room size"
              }
            ]}
          />
          <Panel 
            action="Join"
            informationText="Lorem ipsum"
            informationType="ERROR"
            inputs={[
              {
                type: "address",
                placeholder: "0X123456789",
                label: "Contract address"
              }, {
                type: "code",
                placeholder: "C0D3",
                label: "Room code"
              }
            ]}
          />
          {/* <h1>Homeless Poker: No need for a house </h1>
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
          </Link> */}
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
