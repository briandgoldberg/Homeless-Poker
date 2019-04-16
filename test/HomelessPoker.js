const HomelessPoker = artifacts.require('./HomelessPoker.sol');
const truffleAssert = require('truffle-assertions');
const web3Utils = require('web3-utils'); // TODO : import { toWei } ...

const { toWei, fromWei, fromAscii, toAscii } = web3Utils;

contract('HomelessPoker', async accounts => {
  let homelessPoker;
  const VALUE = toWei('0.1');
  const ROOM_SECRET = fromAscii('ABCD');
  describe('Max 6 player room size', () => {
    beforeEach(async () => {
      homelessPoker = await HomelessPoker.new(
        fromAscii('Player1'),
        6,
        ROOM_SECRET,
        { from: accounts[0], value: VALUE }
      );
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
    describe('register', () => {
      it('should return correct prizepool and contract balance for two registered players', async () => {
        await homelessPoker.register(fromAscii('Player2'), ROOM_SECRET, {
          from: accounts[1],
          value: VALUE
        });
        assert.equal(await homelessPoker.getContractBalance(), VALUE * 2);
      });
      it('should return correct amount of players that has voted', async () => {
        for (let i = 1; i < 6; i++) {
          await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
            from: accounts[i],
            value: VALUE
          });
        }
        assert.equal(await homelessPoker.potiumSize(), 2);
        await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
          from: accounts[0]
        });
        assert.equal(await homelessPoker.getPlayersVotedCount(), 1);
      });

      it('should distribute prizes but leave the deposit for those that havent voted', async () => {
        for (let i = 1; i < 6; i++) {
          assert.equal(await homelessPoker.votingCanStart(), false);
          await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
            from: accounts[i],
            value: VALUE
          });
        }
        assert.equal(await homelessPoker.votingCanStart(), true);
        assert.equal(await homelessPoker.potiumSize(), 2);
        assert.equal(fromWei(await homelessPoker.getContractBalance()), '0.6');
        for (let i = 0; i < 4; i++) {
          await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
            from: accounts[i]
          });
        }
        assert.equal(await homelessPoker.getPlayersVotedCount(), 4);
        assert.equal(await homelessPoker.distributionHasEnded(), true);
        assert.equal(fromWei(await homelessPoker.getContractBalance()), '0.01');
      });
      it('should distribute prizes and all deposits', async () => {
        for (let i = 1; i < 6; i++) {
          await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
            from: accounts[i],
            value: VALUE
          });
        }
        assert.equal(await homelessPoker.potiumSize(), 2);
        assert.equal(fromWei(await homelessPoker.getContractBalance()), '0.6');
        for (let i = 0; i < 4; i++) {
          await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
            from: accounts[i]
          });
        }
        assert.equal(await homelessPoker.getPlayersVotedCount(), 4);
        assert.equal(await homelessPoker.distributionHasEnded(), true);
        assert.equal(fromWei(await homelessPoker.getContractBalance()), '0.01');
        for (let i = 4; i < 6; i++) {
          await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
            from: accounts[i]
          });
        }
        assert.equal(fromWei(await homelessPoker.getContractBalance()), '0');
      });
      it('should throw an error if the same address tries to deposit again', async () => {
        await homelessPoker.register(fromAscii('Player7'), ROOM_SECRET, {
          from: accounts[7],
          value: VALUE
        });
        await truffleAssert.reverts(
          homelessPoker.register(fromAscii('Player7'), ROOM_SECRET, {
            from: accounts[7],
            value: VALUE
          }),
          'You can only deposit once.'
        );
      });
      it('should throw an error if the room is full', async () => {
        for (let i = 1; i < 6; i++) {
          await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
            from: accounts[i],
            value: VALUE
          });
        }
        await truffleAssert.reverts(
          homelessPoker.register(fromAscii(`Player${6}`), ROOM_SECRET, {
            from: accounts[6],
            value: VALUE
          }),
          'Room is full'
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
    });
    describe('setPotiumSize', () => {
      it('should return right amount of players in potium', async () => {
        assert.equal((await homelessPoker.potiumSize()).toNumber(), 2);
      });
    });
    describe('majorityHasVoted', () => {
      it.skip('should return the right flag for majority', async () => {
        await homelessPoker.setMajorityVoted(10, 5);
        assert.equal(await homelessPoker.majorityVoted(), false);
        await homelessPoker.setMajorityVoted(10, 6);
        assert.equal(await homelessPoker.majorityVoted(), true);
        await homelessPoker.setMajorityVoted(2, 6);
        assert.equal(await homelessPoker.majorityVoted(), true);
      });
    });
    describe('getPercentage', () => {
      it('should get correct percentage', async () => {
        assert.equal(
          await homelessPoker.getPercentage(16, 25, { from: accounts[0] }),
          '4'
        );
        assert.equal(
          await homelessPoker.getPercentage(5, 50, { from: accounts[0] }),
          '2'
        );
        assert.equal(
          await homelessPoker.getPercentage(4, 60, { from: accounts[0] }),
          '2'
        );
        assert.equal(
          await homelessPoker.getPercentage(1, 50, { from: accounts[0] }),
          '0'
        );
      });
    });
    describe('vote', () => {
      beforeEach(async () => {
        for (let i = 1; i < 6; i++) {
          await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
            from: accounts[i],
            value: VALUE
          });
        }
      });
      it('should revert if player tries to vote again', async () => {
        await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
          from: accounts[5]
        });
        await truffleAssert.reverts(
          homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
            from: accounts[5]
          }),
          "You can't vote again."
        );
      });
      it('should revert if the amount of players voted for is incorrect', async () => {
        await truffleAssert.reverts(
          homelessPoker.vote(
            [`${accounts[0]}`, `${accounts[1]}`, `${accounts[2]}`],
            {
              from: accounts[1]
            }
          ),
          'The amount of players in ballot has to match the potium size.'
        );
      });
      it('should revert if player is not participating', async () => {
        await truffleAssert.reverts(
          homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
            from: accounts[7]
          }),
          "You can't vote if you're not participating."
        );
      });
    });
    describe('killswitch', () => {
      beforeEach(async () => {
        for (let i = 1; i < 5; i++) {
          await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
            from: accounts[i],
            value: VALUE
          });
        }
      });
      it('should', async () => {
        await homelessPoker.killswitch({
          from: accounts[0]
        });
        // await truffleAssert.reverts(
        //   homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
        //     from: accounts[5]
        //   }),
        //   "You can't vote again."
        // );
      });
    });
  });
  describe('15 player room size', () => {
    beforeEach(async () => {
      homelessPoker = await HomelessPoker.new(
        fromAscii('Player1'),
        15,
        ROOM_SECRET,
        { from: accounts[0], value: VALUE }
      );
    });
    it('should distribute prizes and pay out all deposits', async () => {
      for (let i = 1; i < 15; i++) {
        await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
          from: accounts[i],
          value: VALUE
        });
      }
      assert.equal(await homelessPoker.potiumSize(), 3);
      assert.equal(fromWei(await homelessPoker.getContractBalance()), '1.5');
      for (let i = 0; i < 13; i++) {
        await homelessPoker.vote(
          [`${accounts[0]}`, `${accounts[1]}`, `${accounts[2]}`],
          {
            from: accounts[i]
          }
        );
      }
      assert.equal(await homelessPoker.getPlayersVotedCount(), 13);
      assert.equal(await homelessPoker.distributionHasEnded(), true);
      assert.equal(
        fromWei(await homelessPoker.getContractBalance()).slice(0, 4),
        '0.01'
      );
      for (let i = 13; i < 15; i++) {
        await homelessPoker.vote(
          [`${accounts[0]}`, `${accounts[1]}`, `${accounts[2]}`],
          {
            from: accounts[i]
          }
        );
      }
      assert.equal(
        fromWei(await homelessPoker.getContractBalance()).slice(0, 4),
        '0.00'
      );
    });
    it('should distribute prizes and pay out all deposits', async () => {
      for (let i = 1; i < 15; i++) {
        await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
          from: accounts[i],
          value: VALUE
        });
      }
      assert.equal(await homelessPoker.potiumSize(), 3);
      assert.equal(fromWei(await homelessPoker.getContractBalance()), '1.5');
      for (let i = 0; i < 13; i++) {
        await homelessPoker.vote(
          [`${accounts[0]}`, `${accounts[1]}`, `${accounts[2]}`],
          {
            from: accounts[i]
          }
        );
      }
      assert.equal(await homelessPoker.getPlayersVotedCount(), 13);
      assert.equal(await homelessPoker.distributionHasEnded(), true);
      assert.equal(
        fromWei(await homelessPoker.getContractBalance()).slice(0, 4),
        '0.01'
      );
      for (let i = 13; i < 15; i++) {
        await truffleAssert.reverts(
          homelessPoker.vote(
            [`${accounts[0]}`, `${accounts[1]}`, `${accounts[3]}`],
            {
              from: accounts[i]
            }
          ),
          'Vote has to match the top candidate'
        );
      }
      assert.equal(
        fromWei(await homelessPoker.getContractBalance()).slice(0, 4),
        '0.01'
      );
    });
    it('should trigger killswitch and repay everyone', async () => {
      for (let i = 1; i < 14; i++) {
        await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
          from: accounts[i],
          value: VALUE
        });
      }
      let before = fromWei(await web3.eth.getBalance(accounts[0]));
      await homelessPoker.killswitch();
      assert.equal(fromWei(await homelessPoker.getContractBalance()), '0');

      let after = fromWei(await web3.eth.getBalance(accounts[13]));
      assert.notStrictEqual(after - before, 0.1);
    });
    it('should not trigger killswitch, caller not registered', async () => {
      for (let i = 1; i < 14; i++) {
        await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
          from: accounts[i],
          value: VALUE
        });
      }

      await truffleAssert.reverts(
        homelessPoker.killswitch({ from: accounts[14] }),
        'Player has to be registered to kill contract'
      );
    });
    it('should not trigger killswitch when everyone is registered but no votes are in', async () => {
      for (let i = 1; i < 14; i++) {
        await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
          from: accounts[i],
          value: VALUE
        });
      }
      await homelessPoker.register(fromAscii(`Player${14}`), ROOM_SECRET, {
        from: accounts[14],
        value: VALUE
      });
      await truffleAssert.reverts(
        homelessPoker.killswitch({ from: accounts[14] }),
        'Can not kill a contract with everyone registered and no votes'
      );
    });
    it('should not trigger killswitch, timer hasnt passed', async () => {
      for (let i = 1; i < 15; i++) {
        await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
          from: accounts[i],
          value: VALUE
        });
      }
      await homelessPoker.vote(
        [`${accounts[0]}`, `${accounts[1]}`, `${accounts[2]}`],
        {
          from: accounts[14]
        }
      );
      await truffleAssert.reverts(
        homelessPoker.killswitch({ from: accounts[14] }),
        'An hour must have passed since last vote'
      );
    });
    it('should trigger killswitch and repays everyone', async () => {
      for (let i = 1; i < 14; i++) {
        await homelessPoker.register(fromAscii(`Player${i}`), ROOM_SECRET, {
          from: accounts[i],
          value: VALUE
        });
      }
      assert.equal(await homelessPoker.getContractBalance(), toWei('1.4'));
      await homelessPoker.killswitch({ from: accounts[13] });
      assert.equal(await homelessPoker.getContractBalance(), 0);
    });
  });
});
