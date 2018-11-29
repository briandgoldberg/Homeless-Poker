const PokerTournament = artifacts.require('./PokerTournament.sol');

contract('PokerTournament', async accounts => {
  
  let pokerTournament;
  
  async function deploy() {
    pokerTournament = await PokerTournament.new();
  }

  describe('initialization', () => {
    before(deploy);
    it('prize pool should be initialized as 0', async () => {
      assert.equal(await pokerTournament.getPrizePool(), 0);
    });
  
    it('buy-in should be initialized as 0', async () => {
      assert.equal(await pokerTournament.getBuyIn(), 0);
    })
  })
  before(deploy);
  it('should return correct buy-in', async () => {
    await pokerTournament.setBuyIn(100);
    assert.equal(await pokerTournament.getBuyIn(), 100);
  });
  it('should return correct player count', async () => {
    await pokerTournament.deposit();
    assert.equal(await pokerTournament.getPlayerCount(), 1);
  });

});
