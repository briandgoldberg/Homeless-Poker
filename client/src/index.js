var PokerTournamentContract = require("../../build/contracts/PokerTournament.json")
var Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

const networkId = web3.eth.net.getId();
const deployedNetwork = PokerTournamentContract.networks[networkId];
const instance = new web3.eth.Contract(
    PokerTournamentContract.abi,
    deployedNetwork && deployedNetwork.address
)

console.log(instance)