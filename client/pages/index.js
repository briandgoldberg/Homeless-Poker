/* eslint-disable react/style-prop-object */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import Contract from 'utils/contract'
import Web3 from 'utils/web3'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// import Container from '@material-ui/core/Container'
// import Typography from '@material-ui/core/Typography'
import { Button, Container, List } from 'components'
import Lobby from 'components/Lobby'
import arrayMove from 'array-move'
import styles from '../styles/index.scss'

let web3
try {
  web3 = Web3()
} catch (err) {
  console.error(err)
}
let contract

// const styles = {
//   card: {
//     maxWidth: 275
//   }
// }
class Index extends Component {
  render() {
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    console.log(styles)
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
              <Button title="Create" />
            </a>
          </Link>
          <Link href="/join">
            <a>
              <Button title="Join" />
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
