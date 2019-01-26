var PokerTournament = artifacts.require("./PokerTournament.sol");
var PokerTournamentV2 = artifacts.require("./PokerTournamentV2.sol");

module.exports = function(deployer) {
  deployer.deploy(PokerTournament);
  deployer.deploy(PokerTournamentV2);
};