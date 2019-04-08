import Web3 from 'web3';

const web3 = () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    const resolveEthereum = async () => {
      await window.ethereum.enable();
    };
    resolveEthereum();
    return web3;
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    console.log('Injected web3 detected.');
    return window.web3;
  }
  // Fallback to localhost...
  else {
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    console.log('No web3 instance injected, using Local web3.');
    return new Web3(provider);
  }
};

export default web3;
