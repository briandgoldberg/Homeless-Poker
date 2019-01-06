/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

// See <http://truffleframework.com/docs/advanced/configuration>
// to customize your Truffle configuration!
module.exports = {
  networks: {
    "develop": {
      accounts: 10,
      defaultEtherBalance: 1,
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
      showTimeSpent: true
    }
  },
  compilers: {
    solc: {
      version: '0.4.25'
    }
 }
};
