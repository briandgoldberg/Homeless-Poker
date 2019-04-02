const HomelessPoker = artifacts.require('./HomelessPokerV2.sol');
const truffleAssert = require('truffle-assertions');
const web3Utils = require('web3-utils'); // TODO : import { toWei } ...

const { toWei, fromWei, fromAscii, toAscii } = web3Utils;

contract('HomelessPoker', async accounts => {
  let homelessPoker;
  const VALUE = toWei("0.1");
  const ROOM_SECRET = fromAscii("ABCD");
  describe('Max 6 player room size', () => {
      beforeEach(async () => {
      homelessPoker = await HomelessPoker.new(fromAscii("Player1"), 6, ROOM_SECRET, { from: accounts[0], value: VALUE });
    });
    describe('constructor', () => {
      it('should return the inital values', async () => {
        assert.equal(await homelessPoker.distributionHasEnded(), false);
        assert.equal(await homelessPoker.roomSize(), 6);
      });
      it('should return the correct input values from deployer', async () => {
        assert.equal(await homelessPoker.buyIn(), VALUE);
      });
    });
    describe('participate', () => {
      it('should return correct prizepool and contract balance for two registered players', async () => {
        await homelessPoker.participate(fromAscii("Player2"), ROOM_SECRET, { from: accounts[1], value: VALUE });
        assert.equal(await homelessPoker.getContractBalance(), VALUE*2);
      });

      it('should return correct amount of players that has voted', async () => {
        for (let i = 1; i < 6; i++) {
          await homelessPoker.participate(fromAscii(`Player${i}`), ROOM_SECRET,  { from: accounts[i], value: VALUE });
        }
        assert.equal(await homelessPoker.potiumSize(), 2);
        await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
          from: accounts[0]
        });
        assert.equal(await homelessPoker.getPlayersVotedCount(), 1);
      });

      it('should distribute prizes but leave the deposit for those that havent voted', async () => {
        for (let i = 1; i < 6; i++) {
          assert.equal((await homelessPoker.votingCanStart()), false);
          await homelessPoker.participate(fromAscii(`Player${i}`), ROOM_SECRET, { from: accounts[i], value: VALUE });
        }
        assert.equal(await homelessPoker.votingCanStart(), true);
        assert.equal(await homelessPoker.potiumSize(), 2);
        assert.equal(fromWei(await homelessPoker.getContractBalance()), "0.6")
        for (let i = 0; i < 4; i++) {
          await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
            from: accounts[i]
          });
        }
        assert.equal(await homelessPoker.getPlayersVotedCount(), 4);
        assert.equal(await homelessPoker.distributionHasEnded(), true);
        assert.equal(fromWei(await homelessPoker.getContractBalance()), "0.01");
      });
      it('should distribute prizes and all deposits', async () => {
        for (let i = 1; i < 6; i++) {
          await homelessPoker.participate(fromAscii(`Player${i}`), ROOM_SECRET, { from: accounts[i], value: VALUE });
        }
        assert.equal(await homelessPoker.potiumSize(), 2);
        assert.equal(fromWei(await homelessPoker.getContractBalance()), "0.6")
        for (let i = 0; i < 4; i++) {
          await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
            from: accounts[i]
          });
        }
        assert.equal(await homelessPoker.getPlayersVotedCount(), 4);
        assert.equal(await homelessPoker.distributionHasEnded(), true);
        assert.equal(fromWei(await homelessPoker.getContractBalance()), "0.01");
        for (let i = 4; i < 6; i++) {
          await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
            from: accounts[i]
          });
        }
        assert.equal(fromWei(await homelessPoker.getContractBalance()), "0");
      });
      it('should throw an error if the same address tries to deposit again', async () => {
        await homelessPoker.participate(fromAscii('Player7'), ROOM_SECRET, { from: accounts[7], value: VALUE });
        await truffleAssert.reverts(
          homelessPoker.participate(fromAscii('Player7'), ROOM_SECRET, { from: accounts[7],  value: VALUE }),
          'You can only deposit once.'
        );
      });
    });
    
    describe('getPrizeCalculation', () => {
      it('should return correct number from prizecalculation', async () => {
        assert.equal(
          (await homelessPoker.getPrizeCalculation(1, 2, 100000, {
            from: accounts[0]
          })).toNumber(),
          66666
        );
        assert.equal(
          (await homelessPoker.getPrizeCalculation(2, 2, 100, {
            from: accounts[0]
          })).toNumber(),
          33
        );
        assert.equal(
          (await homelessPoker.getPrizeCalculation(1, 5, 100, {
            from: accounts[0]
          })).toNumber(),
          51
        );
        assert.equal(
          (await homelessPoker.getPrizeCalculation(2, 5, 100, {
            from: accounts[0]
          })).toNumber(),
          25
        );
        assert.equal(
          (await homelessPoker.getPrizeCalculation(3, 5, 100, {
            from: accounts[0]
          })).toNumber(),
          12
        );
        assert.equal(
          (await homelessPoker.getPrizeCalculation(4, 5, 100, {
            from: accounts[0]
          })).toNumber(),
          6
        );
        assert.equal(
          (await homelessPoker.getPrizeCalculation(5, 5, 100, {
            from: accounts[0]
          })).toNumber(),
          3
        );
      });
    })
    describe('setPotiumSize', () => {
      it('should return right amount of players in potium', async () => {
        assert.equal((await homelessPoker.potiumSize()).toNumber(), 2);
      });
    })
    describe('majorityHasVoted', () => {
      it('should return the right flag for majority', async () => {
        assert.equal(await homelessPoker.majorityHasVoted(10,5), false);
        assert.equal(await homelessPoker.majorityHasVoted(10,6), true);
        assert.equal(await homelessPoker.majorityHasVoted(2,6), true);
      });
    })
  })
});
