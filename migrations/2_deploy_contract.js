var PokerTournament = artifacts.require("./PokerTournament.sol");

module.exports = function(deployer) {
  deployer.deploy(PokerTournament);
};