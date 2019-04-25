/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import Contract from 'utils/contract'
import Web3 from 'utils/web3'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
import MuiInput from '@material-ui/core/Input'
import MuiCard from '@material-ui/core/Card'
import MuiCardContent from '@material-ui/core/CardContent'
import List from 'components/List'
import arrayMove from 'array-move'

let web3
try {
  web3 = Web3()
} catch (err) {
  console.error(err)
}
let contract

function Input(props) {
  const { onChange, placeholder } = props
  return <MuiInput placeholder={placeholder} onChange={e => onChange(e)} />
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
}

function Button(props) {
  const { onClick, title } = props
  return (
    <MuiButton variant="contained" color="primary" onClick={() => onClick()}>
      {title}
    </MuiButton>
  )
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

function Card(props) {
  const { children, classes } = props
  return (
    <MuiCard className={classes.card} color="primary">
      <MuiCardContent>{children}</MuiCardContent>
    </MuiCard>
  )
}

Card.propTypes = {
  children: PropTypes.array.isRequired,
  // eslint-disable-next-line react/require-default-props
  classes: PropTypes.object
}

const styles = {
  card: {
    maxWidth: 275
  }
}
class Index extends Component {
  state = {
    items: [
      'Address 1',
      'Address 2',
      'Address 3',
      'Address 4',
      'Address 5',
      'Address 6'
    ],
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
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex)
    }))
  }

  render() {
    const {
      contractAddress,
      contractInstance,
      username,
      value,
      items,
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
          {/* <Input placeholder="secret" onChange={this.handleInput} /> */}
          {' '}
          {contractInstance && registeredPlayers.length > 0 && (
            <List items={registeredPlayers} onChange={this.rearrangeList} />
          )}
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
