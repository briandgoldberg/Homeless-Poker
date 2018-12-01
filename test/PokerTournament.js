const PokerTournament = artifacts.require('./PokerTournament.sol');
const truffleAssert = require('truffle-assertions');

contract('PokerTournament', async accounts => {
  
  let pokerTournament, firstAccount, secondAccount;

  beforeEach(async () => {
    firstAccount = accounts[0];
    secondAccount = accounts[1]

    pokerTournament = await PokerTournament.new({from: firstAccount});

    firstAccount.balance = 10;
    secondAccount.balance = 10;
    firstAccount.value = 10;
    secondAccount.value = 10;
  });

  describe('initialization', () => {
  
    it('all get-functions should be initialized as 0', async () => {
      assert.equal(await pokerTournament.getBuyIn(), 0);
      assert.equal(await pokerTournament.getPlayerCount(), 0);
      assert.equal(await pokerTournament.getPrizePool(), 0)
    });
  })
  describe('interaction', () => { 
    it('should return correct buy-in', async () => {
      await pokerTournament.deposit(100);
      assert.equal(await pokerTournament.getBuyIn(), 100);
    });

    it('should return correct player count', async () => {
      await pokerTournament.deposit(1, {from: firstAccount});
      await pokerTournament.deposit(1, {from: secondAccount});
      assert.equal(await pokerTournament.getPlayerCount(), 2);
    });
  })

  describe('limitations', async () => {
    it('should throw an error if the same address tries to deposit again', async () => {
      await pokerTournament.deposit(9); 
      await truffleAssert.reverts(
        pokerTournament.deposit(9),
        "A player can only deposit once." 
      );
    });
    it.skip('should throw an error if depositee cant afford the buy-in', async () => {
      await truffleAssert.reverts(
        pokerTournament.deposit(123, {from: firstAccount}),
        "Depositee has to afford the transfer" 
      );
    });
  })

});
