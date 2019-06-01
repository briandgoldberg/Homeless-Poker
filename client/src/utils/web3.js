import Web3 from 'web3'

export default () => {
  const { ethereum, web3 } = window
  let provider

  // These options are for web3 > beta.48, but as of now beta.55, deploying contracts doesn't resolve properly.
  // const options = {
  //   transactionConfirmationBlocks: 1,
  //   transactionBlockTimeout: 1
  // }

  if (ethereum) {
    // provider = new Web3(ethereum, undefined, options) // Modern dapp browsers.
    provider = new Web3(ethereum) // Modern dapp browsers.
    const resolveEthereum = async () => {
      await ethereum.enable()
    }
    resolveEthereum()
  } else if (web3) {
    console.log('Injected web3 detected.')
    provider = web3 // Legacy dapp browsers. (Mist/MegaMask)
  } else {
    console.log('No web3 instance injected, using Local web3.')
    const localhost = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
    provider = new Web3(localhost)
  }
  return provider
}
