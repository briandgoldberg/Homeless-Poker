
import PokerTournament from "../../build/contracts/PokerTournament.json";
import Web3 from 'web3';

var web3 = new Web3(Web3.givenProvider || "http://localhost:9545");
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
var eth = web3.eth

// creates a contract object for solidity contracts
var PokerTournamentContract = new eth.Contract(PokerTournament.abi)

// coinbase address - the recipient of the mining reward, defaults to the first account
var coinbase = eth.getCoinbase();
// var balance = eth.getBalance(coinbase);


/* eth.call({
    to: "address"
    data: "data"
}: object,
 [defaultBlock:number|string] 
 [callback:func]
) */
/* web3.eth.estimateGas(callContract object) */

async function getAccounts () {
    return await eth.getAccounts();
}

async function getDefaultAccount() {
    let accounts = await getAccounts();
    return accounts[1];
}

async function getAccountBalance(account) {
    return await eth.getBalance(account);
}

async function getInfo() {
    const defaultAccount = await getDefaultAccount();
    console.log('Accounts', await getAccounts())
    console.log('DefaultAccount', defaultAccount)
    console.log('Coinbase', await eth.getCoinbase())
    console.log('DefaultAccountBalance', await getAccountBalance(defaultAccount))
    //console.log('Coinbase balance', await eth.getBalance(coinbase)
}

getInfo()
//console.log('Default Account', eth.defaultAccount)

// https://github.com/ethereum/wiki/wiki/JavaScript-API