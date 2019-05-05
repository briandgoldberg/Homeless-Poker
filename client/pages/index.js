/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import Contract from 'utils/contract'
import Web3 from 'utils/web3'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { Button, Card, Input, List } from 'components'
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

  join = async (address, userName, value, roomCode) => {
    const { account } = this.state
    try {
      contract = new Contract(web3, address)
      await contract.register(address, account, userName, value, roomCode)
      this.setState({ contractInstance: contract })
      this.getPlayersRegistered()
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract.`)
      console.error(error)
    }
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
    const {
      contractAddress,
      contractInstance,
      username,
      value,
      registeredPlayers,
      roomCode
    } = this.state
    const { classes } = this.props
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Homeless Poker
          </Typography>
          {/* <Link href="/about" color="secondary">
            Go to the about page
          </Link> */}
          <Input
            placeholder="username"
            onChange={this.handleInput('username')}
          />
          <Input
            placeholder="0.0001"
            id="123"
            name="345"
            onChange={this.handleInput('value')}
          />
          <Card classes={classes}>
            <Input
              placeholder="address"
              onChange={this.handleInput('address')}
            />
            <Input
              placeholder="roomCode"
              onChange={this.handleInput('roomcode')}
            />
            <Button
              title="Deposit ether"
              onClick={() =>
                value && this.join(contractAddress, username, value, roomCode)
              }
            />
          </Card>
          <Card classes={classes}>
            <Input
              placeholder="roomsize"
              onChange={this.handleInput('roomsize')}
            />
            <Button title="Start" onClick={this.start} />
          </Card>
          {' '}
          {contractInstance && registeredPlayers.length > 0 && (
            <List items={registeredPlayers} onChange={this.rearrangeList} />
          )}
          <p>Todo: reveal this button when voting can start</p>
          <Button
            title="Vote"
            onClick={() => {
              this.join(registeredPlayers)
            }}
          />
          {/* {contractInstance && (
            <button type="submit" onClick={() => this.getPlayersRegistered()}>
              test
            </button>
          )} */}
          {' '}
        </Box>
      </Container>
    )
  }
}

export default withStyles(styles)(Index)

Index.propTypes = {
  // eslint-disable-next-line react/require-default-props
  classes: PropTypes.object
}
