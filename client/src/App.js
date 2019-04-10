import React, { Component } from 'react'
import ContractArtifacts from './contracts/HomelessPoker.json'
import Web3 from './utils/web3'
import Contract from './utils/contract'
import './App.css'
import { asciiToHex, fromAscii, toWei } from 'web3-utils'
const web3 = Web3()
let c
class App extends Component {
  state = {
    account: null,
    contractAddress: null,
    contract: null,
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
    try {
      c = new Contract(web3)
      c.deploy(this.state.account, 'username', '0.1', 7)
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`)
      console.error(error)
    }
  }

  join = async (address, userName, value, roomCode) => {
    try {
      c = new Contract(web3, address)
      c.register(address, this.state.account, userName, value, roomCode)
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`)
      console.error(error)
    }
    console.log('todo, roomcode *', roomCode)
  }

  vote = async ballot => {
    c.vote(ballot)
  }

  getLobbyInfo = async () => {
    console.log(await this.getBuyIn())
    console.log(await this.getRegisteredPlayers())
  }

  getBuyIn = async () => {
    c.getBuyIn()
  }

  handleChange = event => {
    this.setState({ value: event.target.value })
  }
  handleAddress = event => {
    this.setState({ contractAddress: event.target.value.toString() })
  }

  render() {
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="App">
        <h2>Homeless Poker</h2>
        <button onClick={() => this.start()}>Start</button>
        <input placeholder="address" onChange={e => this.handleAddress(e)} />
        <input placeholder="0.0001" onChange={e => this.handleChange(e)} />
        <button
          onClick={() =>
            this.state.value &&
            this.join(this.state.contractAddress, 'name', this.state.value, 'TEST')
          }
        >
          Deposit ether
        </button>
        {this.state.deposited && <p>You deposited {this.state.value}</p>}
      </div>
    )
  }
}

export default App
