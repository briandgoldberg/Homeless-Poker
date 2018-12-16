var web3 = require('web3');


const PokerTournament = artifacts.require('./PokerTournament.sol');
const truffleAssert = require('truffle-assertions');



contract('PokerTournament', async accounts => {
  
  let pokerTournament;
  let account1, account2, account3, account4, account5, account6, account7, account8, account9, account10;

  beforeEach(async () => {
    // TODO : clean-up
    account1 = accounts[0];
    account2 = accounts[1];
    account3 = accounts[2];
    account4 = accounts[3];
    account5 = accounts[4];
    account6 = accounts[5];
    account7 = accounts[6];
    account8 = accounts[7];
    account9 = accounts[8];
    account10 = accounts[9];
    
    pokerTournament = await PokerTournament.new({ from: account1 });

    for(let i = 0; i < 10; i++) {
      accounts[i].balance = 10;
    }
  });

  describe('initialization', () => {
  
    it('all get-functions should be initialized as 0', async () => {
      assert.equal(await pokerTournament.buyIn(), 0);
      assert.equal(await pokerTournament.getPlayerCount(), 0);
      assert.equal(await pokerTournament.prizePool(), 0)
    });
  })
  describe('interaction', () => { 
    it('should return correct buy-in', async () => {
      await pokerTournament.deposit({ value: 10 } );
      assert.equal(await pokerTournament.buyIn(), 10);
    });

    it('should return correct prize pool', async () => {
      await pokerTournament.deposit({from: account1, value: 10 });
      await pokerTournament.deposit({from: account2, value: 10 });
      assert.equal(await pokerTournament.prizePool(), 20);
    });

    it('should return correct player count', async () => {
      await pokerTournament.deposit({from: account1, value: 10 });
      await pokerTournament.deposit({from: account2, value: 10 });
      assert.equal(await pokerTournament.getPlayerCount(), 2);
    });

    it.skip('should return correct amount of players that has voted', async () => {
      await pokerTournament.deposit({from: account1, value: 10 });
      //console.log(pokerTournament.players(this))
    await pokerTournament.voteForWinner([`${account1}`, `${account2}`], {from: account1})
      assert.equal(await pokerTournament.getPlayersVotedCount(), 1);
    });

    it('Should return the correct potium size', async () => {

      for(let i = 0; i < 5; i++){
        await pokerTournament.deposit({from: accounts[i], value: 10 });
      }
      assert.equal(await pokerTournament.getPotiumSize(), 1);
    });

    it('Should reset the prizePool after everybody voted', async () => {
      
      
      for(let i = 0; i < 5; i++){
        await pokerTournament.deposit({from: accounts[i], value: 10 });
      }

      for(let i = 0; i < 5; i++){
        await pokerTournament.voteForWinner([`${account1}`], {from: accounts[i] });;
      }

      let prizePool = (await pokerTournament.prizePool()).toNumber();
      assert.equal(prizePool, 0);
    });
  })

  describe('limitations', async () => {
    it('should throw an error if the same address tries to deposit again', async () => {
      await pokerTournament.deposit({ value: 10 } );
      await truffleAssert.reverts(
        pokerTournament.deposit({ value: 10 }),
        "A player can only deposit once."
      );
    });
  })

});
