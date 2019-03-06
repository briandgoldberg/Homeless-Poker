const HomelessPoker = artifacts.require('./HomelessPoker.sol');

module.exports = function(deployer) {
  deployer.deploy(HomelessPoker);
};
