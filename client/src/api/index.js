const ContractArtifacts = require('../../../build/HomelessPoker.json');
const Web3 = require('web3');

const web3 = new Web3(Web3.currentProvider || 'http://localhost:9545');
const eth = web3.eth;

const networkId = eth.net.getId();
const deployedNetwork = ContractArtifacts.networks[networkId];
const contractInstance = new eth.Contract(
    ContractArtifacts.abi
);

let contractAddress = ''

// const instance = async () => {
//   const networkId = eth.net.getId();
//   const deployedNetwork = ContractArtifacts.networks[networkId];
//   // console.log('contractAddress:', deployedNetwork && deployedNetwork.address);
//   return new eth.Contract(
//     ContractArtifacts.abi
//     // deployedNetwork && deployedNetwork.address || "0xA7CEC45371adCd537B3AaA6117778fF781A9137d"
//   );
// };

const defaultAccount = async () => {
  return await eth.getAccounts()
  .then((account) => account[0])
}

const testAccount = "0x222b9dbf79318c11f378123eb7d3deef94256ea7"

const deploy = async (account) => {
  await contractInstance
  .deploy({ data: ContractArtifacts.bytecode } )
  .send({ from: account, gas: 2000000 })
  .on('error', (error) => {
    console.log(error)
  })
  .on('receipt', (receipt) => {
    contractAddress = receipt.contractAddress
  })
  console.log('deployed to address: ', contractAddress)
}

deploy(testAccount)

// console.log(instance().then((d) => console.log(d.options.address)));
// const instance = await contract();
// const accounts = eth.getAccounts();

// // Is this needed?
// const GAS = 200000;

const deposit = async (address, value) => {
    await contractInstance
    .deposit()
    .send({ from: address, gas: GAS, value })
    .catch(console.error);
}
// deposit()
    // let methods = await instance()
    // console.log('yay', Object.entries(instance().then((l) => console.log(Object.entries(l)))))
  // return instance.methods
  //   .deposit()
  //   .send({ from: address, gas: GAS, value })
  //   .catch(console.error);

    // instance.events.DepositInfo([options][, callback])
    /*
    return {
      addressRegistered: "",
      buyIn: 0,
      deposit: 0,
      totalPrizePool: 0
    }*/
    // buyIn, deposit, totalPrizePool
// deposit(0x222b9dbf79318c11f378123eb7d3deef94256ea7, 10);



const vote = async (address, ballot) => {
  // await instance.methods
  //   .vote(ballot)
  //   .send({ from: address, gas: GAS })
  //   .catch(console.error);
    // instance.events.VotingInfo([options][, callback])
        /*
    return {
      addressVoted: "",
      ballot: [],
      totalRegistered: 0
      totalVotes: 0,
    }*/

}

module.exports = {
  contractInstance,
  deposit, 
  vote
}
// import ContractArtifacts from '../../build/contracts/HomelessPoker.json';
// import Web3 from 'web3';

// const web3 = new Web3(Web3.currentProvider || 'http://localhost:9545');
// const eth = web3.eth;

// // creates a contract object for solidity contracts
// let contract = async () => {
//   const networkId = await eth.net.getId();
//   const deployedNetwork = ContractArtifacts.networks[networkId];
//   console.log('contractAddress:', deployedNetwork && deployedNetwork.address);
//   return new eth.Contract(
//     ContractArtifacts.abi,
//     deployedNetwork && deployedNetwork.address //"0xA7CEC45371adCd537B3AaA6117778fF781A9137d"
//   );
// };

// let main = async () => {
//   let instance = await contract();
//   let accounts = await eth.getAccounts();
//   let GAS = 200000;
//   let VALUE = 10;

//   await instance.methods
//     .deposit()
//     .send({ from: accounts[4], gas: GAS, value: VALUE })
//     .catch(console.error);
//   await instance.methods
//     .deposit()
//     .send({ from: accounts[5], gas: GAS, value: VALUE })
//     .catch(console.error);

//   await instance.methods
//     .prizePool()
//     .call({ from: accounts[1] })
//     .then(pool => console.log('total prize pool:', pool));

//   await instance.methods
//     .buyIn()
//     .call({ from: accounts[1] })
//     .then(buyIn => console.log('buy-in amount:', buyIn));

//   await instance.methods
//     .getPlayerCount()
//     .call({ from: accounts[1] })
//     .then(playerCount => console.log('player count:', playerCount));

//   await instance.methods
//     .getContractBalance()
//     .call({ from: accounts[1] })
//     .then(contractBalance => console.log('contract balance:', contractBalance));

//   await instance.methods
//     .getPotiumSize()
//     .call({ from: accounts[1] })
//     .then(potiumSize => console.log('potium size:', potiumSize));

//   const estimatedGas = await instance.methods
//     .voteForWinner([accounts[4]])
//     .estimateGas();
//   console.log(estimatedGas);

//   await instance.methods
//     .voteForWinner([accounts[4]])
//     .send({ from: accounts[4], gas: GAS })
//     .catch(console.error);
//   await instance.methods
//     .voteForWinner([accounts[4]])
//     .send({ from: accounts[5], gas: GAS })
//     .catch(console.error);

//   await instance.methods
//     .getPlayerBallot()
//     .call({ from: accounts[4] })
//     .then(accountBalance => console.log('account balance:', accountBalance));

//   await instance.methods
//     .getPlayersVotedCount()
//     .call({ from: accounts[1] })
//     .then(playersVoted => console.log('players voted count:', playersVoted));

//   //.on('error', console.error);
//   //.on('receipt', (receipt) => console.log(receipt.events))

//   // Subscribe to an event:
//   // myContract.once(event[, options], callback)
//   // myContract.events.MyEvent([options][, callback])
// };
// main();

// // https://github.com/ethereum/wiki/wiki/JavaScript-API
