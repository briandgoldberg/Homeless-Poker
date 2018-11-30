const PokerTournament = artifacts.require('./PokerTournament.sol');

contract('PokerTournament', async accounts => {
  
  let pokerTournament;
  


  beforeEach(async () => {
    pokerTournament = await PokerTournament.new();
  });

  describe('initialization', () => {
  
    it('all get functions should be initialized as 0', async () => {
      assert.equal(await pokerTournament.getBuyIn(), 0);
      assert.equal(await pokerTournament.getPlayerCount(), 0);
      assert.equal(await pokerTournament.getPrizePool(), 0)
    });
    it('all get functions should be initialized as 0', async () => {
      assert.equal(await pokerTournament.depositeeAddress.call(), accounts[0]);
    });
  })
  describe('interaction', () => {
 
    it('should return buy-in as 100', async () => {
      await pokerTournament.setBuyIn(100);
      assert.equal(await pokerTournament.getBuyIn(), 100);
    });
    it('should return correct player count as 1', async () => {
      accounts[0].value = 10;
      await pokerTournament.deposit(1);
      assert.equal(await pokerTournament.getPlayerCount(), 1);
    });
  })

  describe.skip('limitations', async () => {

    // todo: fix
    it('should ignore the second deposit from the same address', async () => {
      await pokerTournament.deposit(); 
      assert.throws(async () => { await pokerTournament.deposit() }, Error, "Error thrown");
    });
  })

});
