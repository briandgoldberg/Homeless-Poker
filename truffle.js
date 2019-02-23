require('dotenv').config()
const HDWalletProvider = require("truffle-hdwallet-provider");

// MNEMONIC = MetaMask seed
const MNEMONIC = process.env.MNEMONIC;

module.exports = {
  networks: {
    "develop": {
      accounts: 15,
      defaultEtherBalance: 5,
    },
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      showTimeSpent: true,
      onlyCalledMethods: false
    }
  },
  compilers: {
    solc: {
      version: '0.5.4'
    }
  },
  ropsten: {
  provider: function() {
    return new HDWalletProvider(MNEMONIC, "https://https://ropsten.infura.io/v3/8e61f915bb5a42849d92927bc3f4ff73")
  },
  network_id: 3,
  gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
}
};
