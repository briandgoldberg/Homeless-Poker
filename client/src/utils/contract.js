import { asciiToHex, toWei } from 'web3-utils'
import Artifacts from '../contracts/HomelessPoker.json'

export default class Contract {
  constructor(web3, address = '') {
    this.web3 = web3
    this.contract = new web3.eth.Contract(Artifacts.abi, address)
  }

  generateRoomCode() {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 5)
      .toUpperCase()
  }

  async deploy(msgSender, username, value, roomSize) {
    const roomCode = this.generateRoomCode()
    await this.contract
      .deploy({
        data: Artifacts.bytecode,
        arguments: [asciiToHex(username), roomSize, asciiToHex(roomCode)]
      })
      .send({ from: msgSender, gas: 3000000, value: toWei(value) })
      .on('error', error => {
        console.error(error)
      })
      .on('transactionHash', transactionHash => {
        console.log('TransactionHash: ', transactionHash)
        console.log('RoomCode: ', roomCode)
      })
      .on('receipt', receipt => {
        console.log('ContractAddress: ', receipt.contractAddress)
        this.contract.options.address = receipt.contractAddress
      })
  }

  async register(address, msgSender, username, value, roomCode) {
    console.log('address:', address)
    this.contract.options.address = address
    try {
      await this.contract.methods
        .register(asciiToHex(username), asciiToHex(roomCode))
        .send({ from: msgSender, gas: 2000000, value: toWei(value) })
        .on('error', error => {
          console.log(error)
        })
        .on('receipt', receipt => {
          console.log(receipt)
        })
    } catch (error) {
      console.error('Failed to register')
      if (!address) {
        console.error('Missing address')
      }
    }
  }

  async vote(msgSender, ballot) {
    await this.contract.methods
      .vote(ballot)
      .send({ from: msgSender, gas: 2000000 })
      .on('error', error => {
        console.log(error)
      })
      .on('receipt', receipt => {
        console.log(receipt)
      })
  }

  getBuyIn() {
    return this.contract.methods.buyIn.call()
  }
}
