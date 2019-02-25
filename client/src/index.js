
import PokerTournamentContract from "../../build/contracts/PokerTournament.json";
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "http://localhost:9545");
const eth = web3.eth

// creates a contract object for solidity contracts
let contract = async () => {
    const networkId = await eth.net.getId();
    const deployedNetwork = PokerTournamentContract.networks[networkId];
    console.log('contractAddress:', deployedNetwork && deployedNetwork.address)
    return new eth.Contract(
        PokerTournamentContract.abi,
        "0xA7CEC45371adCd537B3AaA6117778fF781A9137d"
        //deployedNetwork && deployedNetwork.address
    );
}

let main = async () => {
    let instance = await contract()
    let accounts = await eth.getAccounts();
    let GAS = 200000
    let VALUE = 10 

    
    await instance.methods.deposit().send({ from: accounts[4], gas: GAS, value: VALUE})
        .catch(console.error)
    await instance.methods.deposit().send({ from: accounts[5], gas: GAS, value: VALUE})
        .catch(console.error)

    await instance.methods.prizePool().call({ from: accounts[1]})
        .then(pool => console.log('total prize pool:', pool))

    await instance.methods.buyIn().call({ from: accounts[1]})
        .then(buyIn => console.log('buy-in amount:', buyIn))

    await instance.methods.getPlayerCount().call({ from: accounts[1]})
        .then(playerCount => console.log('player count:', playerCount))

    await instance.methods.getContractBalance().call({ from: accounts[1]})
        .then(contractBalance => console.log('contract balance:', contractBalance))


    await instance.methods.getPotiumSize().call({ from: accounts[1]})
        .then(potiumSize => console.log('potium size:', potiumSize))
        
    const estimatedGas = await instance.methods.voteForWinner([accounts[4]]).estimateGas()
    console.log(estimatedGas)

    await instance.methods.voteForWinner([accounts[4]]).send({ from: accounts[4], gas: GAS})
        .catch(console.error)
    await instance.methods.voteForWinner([accounts[4]]).send({ from: accounts[5], gas: GAS})
        .catch(console.error)

    await instance.methods.getPlayerBallot().call({ from: accounts[4]})
        .then(accountBalance => console.log('account balance:', accountBalance))

    await instance.methods.getPlayersVotedCount().call({ from: accounts[1]})
        .then(playersVoted => console.log('players voted count:', playersVoted))

    //.on('error', console.error);
    //.on('receipt', (receipt) => console.log(receipt.events))

    // Subscribe to an event:
    // myContract.once(event[, options], callback)
    // myContract.events.MyEvent([options][, callback])

}
main()

// https://github.com/ethereum/wiki/wiki/JavaScript-API