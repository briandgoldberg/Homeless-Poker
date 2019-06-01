import { asciiToHex, fromWei, hexToAscii, toWei } from 'web3-utils'
import Artifacts from '../contracts/HomelessPoker.json'

export default class Contract {
  constructor(web3, address = '') {
    this.web3 = web3
    this.contract = new web3.eth.Contract(Artifacts.abi, address)
    this.contract.transactionConfirmationBlocks = 1 // only wait for one confirmation to speed up the hang time
  }

  generateRoomCode() {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 4)
      .toUpperCase()
  }

  async deploy(msgSender, username, value, roomSize) {
    const roomCode = this.generateRoomCode()
    let error
    let transactionHash
    await this.contract
      .deploy({
        data: Artifacts.bytecode,
        arguments: [asciiToHex(username), roomSize, asciiToHex(roomCode)]
      })
      .send({ from: msgSender, gas: 3000000, value: toWei(value) })
      .on('error', _error => {
        error = _error
        console.error(_error)
      })
      .on('transactionHash', _transactionHash => {
        transactionHash = _transactionHash
        console.log('TransactionHash: ', _transactionHash)
        console.log('RoomCode: ', roomCode)
      })
      .once('receipt', receipt => {
        // probably not needed, might be able to solve the >beta.48 bug if removed
        // https://github.com/ethereum/web3.js/issues/2661#issuecomment-480881441
        console.log('ContractAddress: ', receipt.contractAddress)
        this.contract.options.address = receipt.contractAddress
      })
      .then(res => res && console.log('re'))
      .catch(err => {
        error = err
        console.log('deploy contract error', err)
      })

    return {
      error,
      contractAddress: this.contract.options.address,
      transactionHash,
      roomCode
    }
  }

  async register(address, msgSender, username, value, roomCode) {
    console.log('address:', address)
    this.contract.options.address = address
    let transactionHash
    try {
      await this.contract.methods
        .register(asciiToHex(username), asciiToHex(roomCode))
        .send({ from: msgSender, gas: 2000000, value: toWei(value) })
        .on('error', error => {
          console.log('RoomCode: ', roomCode)
          console.log(error)
        })
        .on('transactionHash', _transactionHash => {
          transactionHash = _transactionHash
          console.log('TransactionHash: ', _transactionHash)
          console.log('RoomCode: ', roomCode)
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
    return {
      // error,
      // contractAddress: this.contract.options.address,
      transactionHash
      // roomCode
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

  // TODO: killswitch

  getBuyIn() {
    return this.contract.methods.buyIn.call()
  }

  getPotiumSize() {
    return this.contract.methods.potiumSize.call()
  }

  getRoomSize() {
    return this.contract.methods.roomSize.call()
  }

  hasDistributionEnded() {
    return this.contract.methods.distributionHasEnded.call()
  }

  hasMajorityVoted() {
    return this.contract.methods.majorityVoted.call()
  }

  getPlayersRegistered() {
    return this.contract.methods.getPlayersRegistered().call()
  }

  canVotingStart() {
    return this.contract.methods.votingCanStart().call()
  }

  async getPrizeForPlace(place, potiumSize, prizePool) {
    const amount = await this.contract.methods
      .getPrizeCalculation(place, potiumSize, prizePool)
      .call()
    return fromWei(`${amount}`)
  }

  async getUsername(address) {
    const username = await this.contract.methods.getUsername(address).call()
    return hexToAscii(`${username}`)
  }
}
