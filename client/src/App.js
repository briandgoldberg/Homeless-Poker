import React, { Component } from 'react'
import * as Web3 from './utils/web3'
import * as Contract from './utils/contract'
import './App.css'

const web3 = Web3()
let contract
class App extends Component {
  state = {
    account: null,
    contractAddress: null,
    value: null // value that player sends to contract
  }

  componentDidMount = async () => {
    try {
      const account = (await web3.eth.getAccounts())[0]
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
      alert(`Failed to load web3, accounts, or contract. Check console for details.`)
      console.error(error)
    }
  }

  join = async (address, userName, value, roomCode) => {
    const { account } = this.state
    try {
      contract = new Contract(web3, address)
      contract.register(address, account, userName, value, roomCode)
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`)
      console.error(error)
    }
    console.log('todo, roomcode *', roomCode)
  }

  vote = async ballot => {
    contract.vote(ballot)
  }

  handleChange = event => {
    this.setState({ value: event.target.value })
  }

  handleAddress = event => {
    this.setState({ contractAddress: event.target.value.toString() })
  }

  render() {
    const { contractAddress, value } = this.state
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <>
        <h2>Homeless Poker</h2>
        <button type="submit" onClick={() => this.start()}>
          Start
        </button>
        <input placeholder="address" onChange={e => this.handleAddress(e)} />
        <input placeholder="0.0001" onChange={e => this.handleChange(e)} />
        <button
          type="submit"
          onClick={() => value && this.join(contractAddress, 'name', value, 'TEST')}
        >
          Deposit ether
        </button>
      </>
    )
  }
}

export default App
