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
    if (!web3.givenProvider) {
      return (
        <div>Found no Web3 provider, try installing the Metamask extension</div>
      )
    }
    return (
      <>
        <Container>
          <Header
            title="(H1) Homeless Poker: No need for a house"
            subtitle="(H2) No Need for a house"
          >
            <p>What should we call you?</p>
            <Input type="Username" />
          </Header>
          <ActionForm type="Create">
            <div className="informationSection">
              <h3>Title</h3>
              <InformationBox>
                <p>Information about this section</p>
              </InformationBox>
            </div>
            <div className="inputSection">
              <Input />
              <Input />
            </div>
            <Button />
          </ActionForm>
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
