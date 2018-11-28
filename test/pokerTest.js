const PokerTournament = artifacts.require('./PokerTournament.sol');

contract('PokerTournament', async accounts => {
  
  let pokerTournament;
  
  async function deploy() {
    pokerTournament = await PokerTournament.new();
  }
  
  before(deploy);
  
  it('should return correct buy-in', async () => {
    await pokerTournament.setBuyIn(100);
    assert.equal(await pokerTournament.getBuyIn(), 100);
  });
});
