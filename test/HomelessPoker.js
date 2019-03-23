const HomelessPoker = artifacts.require('./HomelessPoker.sol');
const truffleAssert = require('truffle-assertions');
const web3Utils = require('web3-utils'); // TODO : import { toWei } ...

const { toWei, fromWei } = web3Utils;

contract('HomelessPoker', async accounts => {
  let homelessPoker;
  const VALUE = toWei("0.1");
  const PLEDGE = toWei("0.01");
  beforeEach(async () => {
    homelessPoker = await HomelessPoker.new({ from: accounts[0] });
  });

  describe('initialization', () => {
    it('all get-functions should be initialized as 0', async () => {
      assert.equal(await homelessPoker.buyIn(), 0);
      assert.equal(await homelessPoker.prizePool(), 0);
    });
  });
  describe('interaction', () => {
    it('should return correct buy-in', async () => {
      await homelessPoker.deposit({ value: VALUE });
      assert.equal(await homelessPoker.buyIn(), VALUE-PLEDGE);
    });

    it('should return correct prize pool', async () => {
      await homelessPoker.deposit({ from: accounts[0], value: VALUE });
      await homelessPoker.deposit({ from: accounts[1], value: VALUE });

      assert.equal(
        await homelessPoker.prizePool(),
        (VALUE-PLEDGE) + (VALUE-PLEDGE)
      );
    });

    it('should return correct player count', async () => {
      await homelessPoker.deposit({ from: accounts[0], value: VALUE });
      await homelessPoker.deposit({ from: accounts[1], value: VALUE });
      assert.equal(await homelessPoker.getPlayerCount(), 2);
    });

    it('should return correct amount of players that has voted', async () => {
      for (let i = 0; i < 7; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: VALUE });
      }
      await homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
        from: accounts[0]
      });
      assert.equal(await homelessPoker.getPlayersVotedCount(), 1);
    });

    it('Should return the correct potium size', async () => {
      for (let i = 0; i < 5; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: VALUE });
      }
      assert.equal(await homelessPoker.getPotiumSize(), 1);
    });

    it('Should selfdestruct after everybody voted, 5p, potiumSize: 1', async () => {
      let prizePool, pledgePool;

      for (let i = 0; i < 5; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: VALUE });
      }
      prizePool = fromWei(await homelessPoker.prizePool());
      pledgePool = fromWei(await homelessPoker.pledgePool());

      assert.equal(prizePool, 0.45);
      assert.equal(pledgePool, 0.05);

      for (let i = 0; i < 4; i++) {
        await homelessPoker
          .vote([`${accounts[0]}`], {
            from: accounts[i],
            gas: '600000'
          })
          .catch(err => console.log(err));
      }
      // pledgePool = (await homelessPoker.pledgePool()).toNumber();
      // assert.equal(pledgePool, 2);

      let winnerBalanceBefore = await web3.eth.getBalance(accounts[4]);

      await homelessPoker
        .vote([`${accounts[0]}`], { from: accounts[4], gas: '600000' })
        .catch(err => console.log(err));

      let senderbalanceAfter = await web3.eth.getBalance(accounts[0]);
      let winnerBalanceAfter = await web3.eth.getBalance(accounts[4]);

      let winnerDiff = BigInt(winnerBalanceAfter) - BigInt(winnerBalanceBefore);

      // contract should selfdestruct
      assert.equal(await web3.eth.getCode(homelessPoker.address), '0x');
    });

    it('Should reset the prizePool after everybody voted, 10p, potiumSize: 2', async () => {
      let prizePool, pledgePool;

      for (let i = 0; i < 10; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: VALUE });
      }
      prizePool = fromWei(await homelessPoker.prizePool());
      pledgePool = fromWei(await homelessPoker.pledgePool());

      assert.equal(prizePool, 0.90);
      assert.equal(pledgePool, 0.10);

      for (let i = 0; i < 10; i++) {
        await homelessPoker.vote(
          [`${accounts[0]}`, `${accounts[1]}`],
          { from: accounts[i], gas: '2000000' }
        );
      }
    });

    it('Should allow 0 value', async () => {
      let prizePool, pledgePool;

      for (let i = 0; i < 10; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: 0 });
      }
      prizePool = fromWei(await homelessPoker.prizePool());
      pledgePool = fromWei(await homelessPoker.pledgePool());

      assert.equal(prizePool, 0);
      assert.equal(pledgePool, 0);

      for (let i = 0; i < 10; i++) {
        await homelessPoker.vote(
          [`${accounts[0]}`, `${accounts[1]}`],
          { from: accounts[i], gas: '2000000' }
        );
      }
    });
  });

  describe('helpers', () => {
    it('should not be equal', async () => {
      let isNotEqual = await homelessPoker.isEqual(
        [`${accounts[0]}`],
        [`${accounts[1]}`]
      );
      assert.equal(isNotEqual, false);
    });
    it('should be equal', async () => {
      let isEqual = await homelessPoker.isEqual(
        [`${accounts[0]}`],
        [`${accounts[0]}`]
      );
      assert.equal(isEqual, true);
    });
    it('getPercentage', async () => {
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
    it('getPrizeCalculation', async () => {
      assert.equal(
        (await homelessPoker.getPrizeCalculation(1, 2, 100, {
          from: accounts[0]
        })).toNumber(),
        66
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
    it('getPotiumSize', async () => {
      for (let i = 0; i < 5; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: 0 });
      }
      assert.equal((await homelessPoker.getPotiumSize()).toNumber(), 1);
      for (let i = 5; i < 10; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: 0 });
      }
      assert.equal((await homelessPoker.getPotiumSize()).toNumber(), 2);
      for (let i = 10; i < 15; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: 0 });
      }
      assert.equal((await homelessPoker.getPotiumSize()).toNumber(), 3);
    });
  });

  describe('limitations', async () => {
    it('should throw an error if the same address tries to deposit again', async () => {
      await homelessPoker.deposit({ value: VALUE });
      await truffleAssert.reverts(
        homelessPoker.deposit({ value: VALUE }),
        'A player can only deposit once.'
      );
    });
    it('should throw an error if an outside accounts tries to vote', async () => {
      await truffleAssert.reverts(
        homelessPoker.vote([`${accounts[0]}`], {
          from: accounts[0]
        }),
        'Voter should be participating.'
      );
    });
    it('should throw an error if the same address tries to vote again', async () => {
      for (let i = 0; i < 5; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: VALUE });
      }
      await homelessPoker.vote([`${accounts[0]}`], {
        from: accounts[0],
        gas: 3000000
      });

      await truffleAssert.reverts(
        homelessPoker.vote([`${accounts[0]}`], {
          from: accounts[0],
          gas: 3000000
        }),
        'A player can only vote once.'
      );
    });
    it('should throw an error if value is deposited after voting has started', async () => {
      for (let i = 0; i < 5; i++) {
        await homelessPoker.deposit({ from: accounts[i], value: VALUE });
      }
      await homelessPoker.vote([`${accounts[0]}`], {
        from: accounts[0]
      });
      await truffleAssert.reverts(
        homelessPoker.deposit({ from: accounts[6], value: VALUE }),
        'Voting started, registration has ended.'
      );
    });
    it('should throw an error if the amount of address voted for doesnt match potium size', async () => {
      await homelessPoker.deposit({ from: accounts[0], value: VALUE });
      await truffleAssert.reverts(
        homelessPoker.vote([`${accounts[0]}`, `${accounts[1]}`], {
          from: accounts[0]
        }),
        'The amount of addresses in player ballot has to match the potium size.'
      );
    });
    it('should throw an error if deposit amount doesnt match buy-in', async () => {
      await homelessPoker.deposit({ from: accounts[0], value: VALUE });
      await truffleAssert.reverts(
        homelessPoker.deposit({ from: accounts[1], value: 15 }),
        'Value sent has to match the buy-in + deposit amount.'
      );
    });
  });
});
