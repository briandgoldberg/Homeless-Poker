import React, { Component } from "react";
import ContractArtifacts from "./contracts/HomelessPoker.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    registeredPlayersCount: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    contractAddress: null,
    value: null // value that player sends to contract
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const account = (await web3.eth.getAccounts())[0];

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ContractArtifacts.networks[networkId];
      const instance = new web3.eth.Contract(
        ContractArtifacts.abi,
        deployedNetwork && deployedNetwork.address
        // "0x13c273cb47c7c1fE62865e5b2069C361C574a7F5"
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account, contract: instance }, () => this.deploy(account));
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  // To use a local account through metamask, copy the private key from the RPC and import to metamask

  deploy = async (account) => {
    const { contract } = this.state;
    await contract
      .deploy({ data: ContractArtifacts.bytecode })
      .send({ from: account, gas: 2000000 })
      .on('error', (error) => {
        console.log(error)
      })
      .on('transactionHash', (transactionHash) => { console.log('TransactionHash', transactionHash) })
      .on('receipt', (receipt) => {
      this.setState({ contractAddress: receipt.contractAddress })
        contract.options.address = receipt.contractAddress
      })
    console.log('Deployed to address: ', this.state.contractAddress)
  }

  deposit = async (address, value) => {
    const { contract } = this.state;
    await contract.methods
      .deposit()
      .send({ from: address, gas: 2000000, value })
      .on('error', (error) => {
        console.log(error)
      })
      .on('receipt', (receipt) => {
        console.log(receipt)
      })

    // console.log(web3.utils.fromWei((await this.getPrizePool()).toString()))
    
    this.getLobbyInfo()
  }

  getLobbyInfo = async () => {
    // create an event in the contract for this information, that is triggered after every deposit
    console.log(await this.getPrizePool())
    console.log(await this.getDepositPool())
    console.log(await this.getBuyIn())
    console.log(await this.getDeposit())
  }

  fromWei = (amount) => {
    const { web3 } = this.state;
    return web3.utils.fromWei((amount).toString())
  }

  getPrizePool = async () => {
    const { contract } = this.state;
    return this.fromWei(await contract.methods.prizePool.call());
  }

  getDepositPool = async () => {
    const { contract } = this.state;
    return this.fromWei(await contract.methods.depositPool.call());
  }

  getBuyIn = async () => {
    const { contract } = this.state;
    return this.fromWei(await contract.methods._buyIn.call());
  }

  // need to rename the individual deposit
  getDeposit = async () => {
    const { contract } = this.state;
    return this.fromWei(await contract.methods._deposit.call());
  }

  handleChange = (event) => {
    console.log(this.state.value)
    this.setState({ value: event.target.value })
  }

  render() {
    const { account, web3 } = this.state;
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h2>Smart Contract Example</h2>
        <div> Registered player count: {this.state.registeredPlayersCount}</div>
        <input placeholder="0.0001" onChange={(e) => this.handleChange(e)}  ></input>
        <button onClick={() => this.state.value && this.deposit(account, web3.utils.toWei(this.state.value.toString()))}>Deposit ether</button>
      </div>
    );
  }
}

export default App;
