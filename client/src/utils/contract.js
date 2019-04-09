import Artifacts from './../contracts/HomelessPoker.json';
import { asciiToHex, fromAscii, toWei } from 'web3-utils';

class Contract {
  constructor(web3, address = '') {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(Artifacts.abi, address);
  }
  generateRoomCode = () => {
    return 'TEST';
    // return Math.random()
    //   .toString(36)
    //   .replace(/[^a-z]+/g, '')
    //   .substr(0, 5)
    //   .toUpperCase();
  };
  async deploy(msgSender, username, value, roomSize) {
    await this.contract
      .deploy({
        data: Artifacts.bytecode,
        arguments: [
          asciiToHex(username),
          roomSize,
          asciiToHex(this.generateRoomCode())
        ]
      })
      .send({ from: msgSender, gas: 2000000, value: toWei(value) })
      .on('error', error => {
        console.error(error);
      })
      .on('transactionHash', transactionHash => {
        console.log('TransactionHash: ', transactionHash);
      })
      .on('receipt', receipt => {
        console.log('ContractAddress: ', receipt.contractAddress);
        this.contract.options.address = receipt.contractAddress;
      });
  }
  async register(address, msgSender, username, value, roomCode) {
    console.log('address:', address);
    this.contract.options.address = address;
    await this.contract.methods
      .register(asciiToHex(username), asciiToHex(roomCode))
      .send({ from: msgSender, gas: 2000000, value: toWei(value) })
      .on('error', error => {
        console.log(error);
      })
      .on('receipt', receipt => {
        console.log(receipt);
      });
  }
  async vote(msgSender, ballot) {
    await this.contract.methods
      .vote(ballot)
      .send({ from: msgSender, gas: 2000000 })
      .on('error', error => {
        console.log(error);
      })
      .on('receipt', receipt => {
        console.log(receipt);
      });
  }
  async getBuyIn() {
    return await this.contract.methods.buyIn.call();
  }
}
export default Contract;
