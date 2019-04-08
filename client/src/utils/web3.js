import Web3 from 'web3';

export default class web3 {
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
    const getAccount = async (i = 0) => {
      return (await web3.eth.getAccounts())[i];
    };

    web3.userAccount = getAccount();

    return web3;
  }
}
