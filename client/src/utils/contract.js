// // const Artifacts = require('../contracts/HomelessPoker.json');
const web3 = require('./web3');
// const web3 = setProvider();

const getAccount = () => {
  console.log(web3.currentProvider);
  return web3.eth.getAccounts()[0];
};

export { getAccount };
