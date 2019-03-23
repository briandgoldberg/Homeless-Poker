import React, { Component } from "react";
import ContractArtifacts from "./contracts/HomelessPoker.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    registeredPlayers: 0,
    votedPlayers: 0,
    web3: null,
    account: null,
    contract: null,
    contractAddress: null,
    value: null, // value that player sends to contract
    deposited: false,
    voted: false
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const account = (await web3.eth.getAccounts())[0];

      this.setState({ account, web3 });
    } catch (error) {
      alert(
        `Failed to load web3.`,
      );
      console.error(error);
    }
  };

  start = async (address) => {
    let contractAddress = address || "";
    if (address === "TEST") {
      contractAddress = "0x5013E5D122105358aE0e25eE99bBa4E1F068f791"
    }

    try {
      const contract = this.getContractInstance(contractAddress)
      this.setState({ contract }, () => !address && this.deploy());
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  getContractInstance = (address) => {
    const { web3 } = this.state;
    return new web3.eth.Contract(ContractArtifacts.abi, address)
  }
  // To use a local account through metamask, copy the private key from the RPC and import to metamask
  deploy = async () => {
    const { account, contract } = this.state;
    await contract
      .deploy({ data: ContractArtifacts.bytecode })
      .send({ from: account, gas: 2000000 })
      .on('error', (error) => {
        console.error(error)
      })
      .on('transactionHash', (transactionHash) => { console.log('TransactionHash', transactionHash) })
      .on('receipt', (receipt) => {
        this.setState({ contractAddress: receipt.contractAddress })
        contract.options.address = receipt.contractAddress
      })
    console.log('Deployed to address: ', this.state.contractAddress)
  }
  deposit = async (value) => {
    const { account, contract } = this.state;
    await contract.methods
      .deposit()
      .send({ from: account, gas: 2000000, value })
      .on('error', (error) => {
        console.log(error)
      })
      .on('receipt', (receipt) => {
        this.setState({ voted: true, votedPlayers: this.state.votedPlayers +1 })
        console.log(receipt)
      })

    this.getLobbyInfo()
  }
  vote = async (ballot) => {
    const { account, contract } = this.state;
    await contract.methods
      .vote(ballot)
      .send({ from: account, gas: 2000000})
      .on('error', (error) => {
        console.log(error)
      })
      .on('receipt', (receipt) => {
        this.setState({ deposited: true, votedPlayers: this.state.votedPlayers +1 })
        console.log(receipt)
      })
  }

  getLobbyInfo = async () => {
    // create an event in the contract for this information, that is triggered after every deposit
    console.log(await this.getPrizePool())
    console.log(await this.getPledgePool())
    console.log(await this.getBuyIn())
    console.log(await this.getPledge())
    console.log(await this.getRegisteredPlayers())
  }

  fromWei = (amount) => {
    const { web3 } = this.state;
    return web3.utils.fromWei((amount).toString())
  }

  getPrizePool = async () => {
    const { contract } = this.state;
    return this.fromWei(await contract.methods.prizePool.call());
  }

  getPledgePool = async () => {
    const { contract } = this.state;
    return this.fromWei(await contract.methods.pledgePool.call());
  }

  getBuyIn = async () => {
    const { contract } = this.state;
    return this.fromWei(await contract.methods.buyIn.call());
  }

  getPledge = async () => {
    const { contract } = this.state;
    return this.fromWei(await contract.methods.pledge.call());
  }

  getRegisteredPlayers = async () => {
    const { contract } = this.state;
    const registeredPlayerCount = await contract.methods.getPlayerCount.call()
    const registeredPlayers = []
    for(let i = 0; i < registeredPlayerCount; i++){
      registeredPlayers.push(await contract.methods.playersRegistered(i).call())
    }
    return registeredPlayers;
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
  }

  render() {
    const { web3 } = this.state;
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h2>Smart Contract Example</h2>
        <button onClick={() => this.start()}>Start</button>
        <button onClick={() => this.start("TEST")}>Join</button>
        <div> Registered player count: {this.state.registeredPlayers
        }</div>
        {/* { !this.state.deposited && (<> */}
        <input placeholder="0.0001" onChange={(e) => this.handleChange(e)}></input>
        <button onClick={() => this.state.value && this.deposit(web3.utils.toWei(this.state.value.toString()))}>Deposit ether</button>
        {/* </>)} */}
        { this.state.deposited && <p>You deposited {this.state.value}</p>}

      </div>
    );
  }
}

export default App;
