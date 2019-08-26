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
      .on('transactionHash', _transactionHash => {
        transactionHash = _transactionHash
        console.log('TransactionHash: ', _transactionHash)
        console.log('RoomCode: ', roomCode)
      })
      .on('confirmation', (confNumber, receipt) => {
        console.log('contractAddress: ', receipt.contractAddress)
        this.contract.options.address = receipt.contractAddress
      })
      .then(res => res)
      .catch(err => {
        error = err
      })

    return {
      error,
      contractAddress: this.contract.options.address,
      transactionHash,
      roomCode
    }
  }

  async register(address, msgSender, username, value, roomCode) {
    // TODO: value is not being used any more, I fetch it in the line below
    const val = await this.getBuyIn()
    console.log('value', value)
    console.log('buyin')
    console.log('address:', address)
    this.contract.options.address = address
    let transactionHash
    let error
    !username && console.error('username is missing')
    await this.contract.methods
      .register(asciiToHex(username), asciiToHex(roomCode))
      .send({
        from: msgSender,
        gas: 2000000,
        value: val.toString()
      })
      .on('transactionHash', _transactionHash => {
        transactionHash = _transactionHash
        console.log('TransactionHash: ', _transactionHash)
        console.log('RoomCode: ', roomCode)
      })
      .on('confirmation', (confNumber, receipt) => {
        console.log('reciept', receipt)
      })
      .then(res => res)
      .catch(_error => {
        error = _error
        console.error(_error)
      })
    return {
      error,
      transactionHash
    }
  }

  async vote(msgSender, ballot) {
    let transactionHash
    let error
    await this.contract.methods
      .vote(ballot)
      .send({ from: msgSender, gas: 2000000 })
      .on('transactionHash', _transactionHash => {
        transactionHash = _transactionHash
        console.log('TransactionHash: ', _transactionHash)
      })
      .then(res => res)
      .catch(_error => {
        // eslint-disable-next-line prefer-destructuring
        error = _error
      })

    return {
      error,
      transactionHash
    }
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
