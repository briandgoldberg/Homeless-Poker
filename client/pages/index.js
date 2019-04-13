import React, { Component } from 'react'
import Contract from 'utils/contract'
import Web3 from 'utils/web3'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
import MuiInput from '@material-ui/core/Input'

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

export default class Index extends Component {
  state = {
    account: null,
    contractAddress: null,
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
    const { account } = this.state
    try {
      contract = new Contract(web3)
      contract.deploy(account, 'username', '0.1', 7)
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }

  join = async (address, userName, value, roomCode) => {
    const { account } = this.state
    try {
      contract = new Contract(web3, address)
      contract.register(address, account, userName, value, roomCode)
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
    console.log('todo, roomcode *', roomCode)
  }

  vote = async ballot => {
    contract.vote(ballot)
  }

  handleValue = event => {
    this.setState({ value: event.target.value })
  }

  handleAddress = event => {
    this.setState({ contractAddress: event.target.value })
  }

  render() {
    const { contractAddress, value } = this.state
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
          <Button title="Start" onClick={this.start} />
          <Input placeholder="address" onChange={this.handleAddress} />
          <Input placeholder="0.0001" onChange={this.handleValue} />
          {/* <Input placeholder="secret" onChange={this.handleValue} /> */}
          <Button
            title="Deposit ether"
            onClick={() =>
              value && this.join(contractAddress, 'name', value, 'TEST')
            }
          />
          {' '}
        </Box>
      </Container>
    )
  }
}
