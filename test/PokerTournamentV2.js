var web3 = require('web3');


const PokerTournament = artifacts.require('./PokerTournamentV2.sol');
const truffleAssert = require('truffle-assertions');



contract('PokerTournamentV2', async accounts => {

  let pokerTournament;

  const VALUE = 10;
  const BUYIN = 100;


  beforeEach(async () => {
    pokerTournament = await PokerTournament.new({ from: accounts[0] });
    await pokerTournament.setBuyIn(BUYIN, { from: accounts[0] })
  });

  // describe('initialization', () => {

  //   it('all get-functions should be initialized as 0', async () => {
  //     assert.equal(await pokerTournament.buyIn(), 0);
  //     assert.equal(await pokerTournament.getPlayerCount(), 0);
  //     assert.equal(await pokerTournament.prizePool(), 0)
  //   });
  // })
  describe('interaction', () => { 
    it('should return correct buy-in', async () => {
      await pokerTournament.deposit({ from: accounts[1], value: BUYIN } );
      assert.equal(await pokerTournament.buyIn(), BUYIN);
    });

    it('should return correct prize pool', async () => {
      await pokerTournament.deposit({from: accounts[1], value: BUYIN });
      await pokerTournament.deposit({from: accounts[2], value: BUYIN });
      assert.equal(await pokerTournament.prizePool(), BUYIN+BUYIN);
    });

    it('should return correct player count', async () => {
      await pokerTournament.deposit({from: accounts[1], value: BUYIN });
      await pokerTournament.deposit({from: accounts[2], value: BUYIN });
      assert.equal(await pokerTournament.getPlayerCount(), 2);
    });

    it('Should return the correct potium size', async () => {
      for(let i = 1; i < 6; i++){
        await pokerTournament.deposit({from: accounts[i], value: BUYIN });
      }
      assert.equal(await pokerTournament.getPotiumSize(), 1);
    });
  })

  describe('limitations', async () => {
    it('should throw an error if the same address tries to deposit again', async () => {
      await pokerTournament.deposit({ from: accounts[1], value: BUYIN } );
      await truffleAssert.reverts(
        pokerTournament.deposit({ from: accounts[1], value: BUYIN }),
        "A player can only deposit once."
      );
    });
    it('should throw an error if the amount of address voted for doesnt match potium size', async () => {
      await pokerTournament.deposit({from: accounts[0], value: BUYIN });
      await truffleAssert.reverts(
        pokerTournament.voteForWinner([`${accounts[1]}`, `${accounts[2]}`], {from: accounts[0]}),
        "The amount of addresses in ballot has to match the potium size."
      )
    });
    it('should throw an error if deposit amount doesnt match buy-in', async () => {
      await truffleAssert.reverts(
        pokerTournament.deposit({from: accounts[1], value: 15 }),
        "Deposit amount has to match the buy-in amount."
      )
    });
  })
});
