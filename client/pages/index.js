/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import Contract from 'utils/contract'
import Web3 from 'utils/web3'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
// import Typography from '@material-ui/core/Typography'
import { Button, List } from 'components'
import Lobby from 'components/Lobby'
import arrayMove from 'array-move'

let web3
try {
  web3 = Web3()
} catch (err) {
  console.error(err)
}
let contract

const styles = {
  card: {
    maxWidth: 275
  }
}
class Index extends Component {
  state = {
    account: null,
    contractAddress: null,
    contractInstance: null,
    registeredPlayers: [],
    username: null,
    roomCode: null,
    roomSize: null,
    value: null // value that player sends to contract
  }

  componentDidMount = async () => {
    try {
      const account = (await web3.eth.getAccounts())[0]
      console.log(account)
      this.setState({ account })
    } catch (error) {
      alert(`Failed to load web3.`)
      console.error(error)
    }
  }

  start = async () => {
    const { account, username, value, roomSize } = this.state
    try {
      contract = new Contract(web3)
      await contract.deploy(account, username, value, roomSize)
      this.setState({ contractInstance: contract })
      this.getPlayersRegistered()
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract.`)
      console.error(error)
    }
  }

  join = async () => {
    const { account, contractAddress, username, roomCode, value } = this.state
    try {
      contract = new Contract(web3, contractAddress)
      console.log('join from address', account)
      await contract.register(
        contractAddress,
        account,
        username,
        value,
        roomCode
      )
      this.setState({ contractInstance: contract })
      this.getPlayersRegistered()
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract.`)
      console.error(error)
    }
  }

  getPrizehandoutForPlace = async place => {
    const { contractInstance } = this.state
    const potiumSize = await contractInstance.getPotiumSize()
    const prizePool =
      (await contractInstance.getRoomSize()) *
      (await contractInstance.getBuyIn())
    return contractInstance.getPrizeForPlace(place, potiumSize, `${prizePool}`)
  }

  getPlayersRegistered = async () => {
    const { contractInstance } = this.state
    let registeredPlayers = null
    try {
      console.log(await contractInstance.getPlayersRegistered())
      registeredPlayers = await contractInstance.getPlayersRegistered()
      this.setState({ registeredPlayers })
    } catch (error) {
      console.error(error)
    }
    return registeredPlayers
  }

  vote = async ballot => {
    contract.vote(ballot)
  }

  handleInput = type => event => {
    console.log(type)
    if (type === 'value') {
      this.setState({ value: event.target.value })
    } else if (type === 'address') {
      this.setState({ contractAddress: event.target.value })
    } else if (type === 'username') {
      this.setState({ username: event.target.value })
    } else if (type === 'roomcode') {
      this.setState({ roomCode: event.target.value })
    } else if (type === 'roomsize') {
      this.setState({ roomSize: event.target.value })
    }
  }

  rearrangeList = ({ oldIndex, newIndex }) => {
    this.setState(({ registeredPlayers }) => ({
      registeredPlayers: arrayMove(registeredPlayers, oldIndex, newIndex)
    }))
  }

  render() {
    const { contractInstance, value /* , registeredPlayers */ } = this.state

    // temp
    const registeredPlayers = ['yolo', 'swage', 'lals']
    const { classes } = this.props
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <Container maxWidth="sm">
        <Grid container spacing={8}>
          <Grid item xs={12} sm container>
            <Lobby
              classes={classes}
              handleInput={this.handleInput}
              join={this.join}
              start={value && this.start}
            />
          </Grid>
          <Grid item xs={12} container>
            {/* {contractInstance && registeredPlayers.length > 0 && ( */}
            <List items={registeredPlayers} onChange={this.rearrangeList} />
            {/* )} */}
          </Grid>
          <Grid item xs={12} container>
            <Button
              title="Vote"
              onClick={() => {
                this.vote(registeredPlayers)
              }}
            />
          </Grid>
          <Grid item xs={12} container>
            {contractInstance && (
              <>
                <button
                  type="submit"
                  onClick={() => this.getPrizehandoutForPlace(1)}
                >
                  test
                </button>
                <p>losads</p>
              </>
            )}
          </Grid>
          {' '}
        </Grid>
      </Container>
    )
  }
}

export default withStyles(styles)(Index)

Index.propTypes = {
  // eslint-disable-next-line react/require-default-props
  classes: PropTypes.object
}
