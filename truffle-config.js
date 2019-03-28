require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
const buildPath = `${__dirname}/client/src/contracts`;

// MNEMONIC = MetaMask seed
const MNEMONIC = process.env.MNEMONIC;
const infuraRopstenApiKey = '8e61f915bb5a42849d92927bc3f4ff73';
module.exports = {
  contracts_build_directory: buildPath,
  networks: {
    develop: {
      accounts: 15,
      defaultEtherBalance: 300
    },
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          MNEMONIC,
          `https://ropsten.infura.io/v3/${infuraRopstenApiKey}`
        );
      },
      network_id: 3,
      gas: 4000000 //make sure this gas allocation isn't over 4M, which is the max
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD',
      showTimeSpent: true,
      onlyCalledMethods: false
    }
  },
  compilers: {
    solc: {
      version: '0.5.6'
    }
  }
};
