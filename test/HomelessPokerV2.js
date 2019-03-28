const HomelessPoker = artifacts.require('./HomelessPokerV2.sol');
const truffleAssert = require('truffle-assertions');
const web3Utils = require('web3-utils'); // TODO : import { toWei } ...

const { toWei, fromWei, fromAscii, toAscii } = web3Utils;

contract('HomelessPoker', async accounts => {
  let homelessPoker;
  const VALUE = toWei("0.1");
  beforeEach(async () => {
    homelessPoker = await HomelessPoker.new(fromAscii("Player1"), 10, { from: accounts[0], value: VALUE });
  });

  describe('constructor', () => {
    it('should return the inital values', async () => {
      assert.equal(await homelessPoker.votingHasStarted(), false);
      assert.equal(await homelessPoker.distributionHasEnded(), false);
    });
    it('should return the correct values after deployment', async () => {
      assert.equal(await homelessPoker.buyIn(), VALUE);
      assert.equal(await homelessPoker.prizePool(), VALUE*0.95);
      assert.equal(await homelessPoker.depositPool(), VALUE*0.05);
      assert.equal(await homelessPoker.roomSize(), 10);
    });
  });
});
