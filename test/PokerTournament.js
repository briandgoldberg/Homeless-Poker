var web3 = require('web3');


const PokerTournament = artifacts.require('./PokerTournament.sol');
const truffleAssert = require('truffle-assertions');



contract('PokerTournament', async accounts => {
  
  let pokerTournament;
  let account1, account2, account3, account4, account5, account6, account7, account8, account9, account10;
  
  const VALUE = 10;

  

  beforeEach(async () => {
    account1 = accounts[0];
    account2 = accounts[1];
    
    pokerTournament = await PokerTournament.new({ from: account1 });

    //this is not workin
    for(let i = 0; i < 10; i++) {
      accounts[i].balance = VALUE;
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
      await pokerTournament.deposit({ value: VALUE } );
      assert.equal(await pokerTournament.buyIn(), VALUE);
    });

    it('should return correct prize pool', async () => {
      await pokerTournament.deposit({from: account1, value: VALUE });
      await pokerTournament.deposit({from: account2, value: VALUE });
      assert.equal(await pokerTournament.prizePool(), VALUE+VALUE);
    });

    it('should return correct player count', async () => {
      await pokerTournament.deposit({from: account1, value: VALUE });
      await pokerTournament.deposit({from: account2, value: VALUE });
      assert.equal(await pokerTournament.getPlayerCount(), 2);
    });

    it('should return correct amount of players that has voted', async () => {
      for(let i = 0; i < 6; i++){
        await pokerTournament.deposit({from: accounts[i], value: VALUE });
      }
      //console.log(pokerTournament.players(this))
      await pokerTournament.voteForWinner([`${accounts[0]}`, `${accounts[1]}`], {from: account1})
      assert.equal(await pokerTournament.getPlayersVotedCount(), 1);
    });

    it('Should return the correct potium size', async () => {

      for(let i = 0; i < 5; i++){
        await pokerTournament.deposit({from: accounts[i], value: VALUE });
      }
      assert.equal(await pokerTournament.getPotiumSize(), 1);
    });

    it('Should reset the prizePool after everybody voted, potium: 1', async () => {

      for(let i = 0; i < 5; i++){
        await pokerTournament.deposit({from: accounts[i], value: VALUE });
      
      }
      
      for(let i = 0; i < 5; i++){
        await pokerTournament.voteForWinner([`${account1}`], {from: accounts[i] });;
      }

      let prizePool = (await pokerTournament.prizePool()).toNumber();
      assert.equal(prizePool, 0);
    });

    it('Should reset the prizePool after everybody voted, potiumSize: 2', async () => {

      for(let i = 0; i < 10; i++){
        await pokerTournament.deposit({from: accounts[i], value: VALUE });
      }

      for(let i = 0; i < 10; i++){
        await pokerTournament.voteForWinner([`${account1}`, `${account2}`], {from: accounts[i] });;
      }

      let prizePool = (await pokerTournament.prizePool()).toNumber();
    
      assert.equal(prizePool, 0);
      // assert.equal(await pokerTournament.getContractBalance().toNumber(), 0);
    });
  })

  describe('limitations', async () => {
    it('should throw an error if the same address tries to deposit again', async () => {
      await pokerTournament.deposit({ value: VALUE } );
      await truffleAssert.reverts(
        pokerTournament.deposit({ value: VALUE }),
        "A player can only deposit once."
      );
    });
    it('should throw an error if an outside accounts tries to vote', async () => {
      await truffleAssert.reverts(
        pokerTournament.voteForWinner([`${accounts[0]}`], {from: accounts[0] }),
        "Voter should be participating."
      );
    });
    it('should throw an error if the same address tries to vote again', async () => {
      await pokerTournament.deposit({from: accounts[0], value: VALUE } );
      await pokerTournament.voteForWinner([`${accounts[0]}`], {from: accounts[0] });

      await truffleAssert.reverts(
        pokerTournament.voteForWinner([`${accounts[0]}`], {from: accounts[0] }),
        "A player can only vote once."
        );
    });
    it('should throw an error if the amount of address voted for doesnt match potium size', async () => {
      await pokerTournament.deposit({from: accounts[0], value: VALUE });
      await truffleAssert.reverts(
        pokerTournament.voteForWinner([`${accounts[0]}`, `${accounts[1]}`], {from: accounts[0]}),
        "The amount of addresses in player ballot has to match the potium size."
      )
    });
    it('should throw an error if deposit amount doesnt match buy-in', async () => {
      await pokerTournament.deposit({from: accounts[0], value: VALUE });
      await truffleAssert.reverts(
        pokerTournament.deposit({from: accounts[1], value: 15 }),
        "Deposit amount has to match the buy-in amount."
      )
    });
  })
});
