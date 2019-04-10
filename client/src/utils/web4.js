import Web3 from 'web3';

class web3 {
  constructor() {
    let web3;
    // Modern dapp browsers...
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      const resolveEthereum = async () => {
        await window.ethereum.enable();
      };
      resolveEthereum();
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      // Use Mist/MetaMask's provider.
      console.log('Injected web3 detected.');
      web3 = window.web3;
    }
    // Fallback to localhost...
    else {
      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      console.log('No web3 instance injected, using Local web3.');
      web3 = new Web3(provider);
    }
    // web3.userAccount = this.getAccount();
    // this.web3 = web3;
    return web3;
  }
  // async getAccount(i = 0) {
  //   console.log(web3);
  //   // return (await web3.eth.getAccounts())[i];
  // }
}
export default web3;
