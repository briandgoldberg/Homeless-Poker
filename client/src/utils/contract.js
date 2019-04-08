// // const Artifacts = require('../contracts/HomelessPoker.json');
import web3 from './web3';
// const web3 = setProvider();

class Contract extends web3 {
  constructor() {
    super();
    this.web3 = web3;
  }
  static test() {
    return 'test';
  }
}
export { Contract };
// const getAccount = async () => {
//   console.log(web3.currentProvider);
//   return web3.eth.getAccounts()[0];
// };

// export { getAccount };
