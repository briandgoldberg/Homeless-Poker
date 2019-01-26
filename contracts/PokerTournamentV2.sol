pragma solidity ^0.4.25;

// https://github.com/MeadowSuite/Meadow/wiki/Using-the-VSCode-Solidity-Debugger

contract PokerTournamentV2 {
    address public owner;

    uint public buyIn;
    uint public prizePool;
    address[] private playersRegistered;

    // TODO: does this work ?
    mapping(address => bool) private isRegistered;


    event Payout (uint prize);

    constructor() public {
        owner = msg.sender;
    }

    modifier ownerOnly() {
        owner = msg.sender;
        _;
    }

    function setBuyIn(uint amount) public ownerOnly {
        require(amount >= 0, "The buy-in amount has to be positive.");
        buyIn = amount;
    }

    function deposit() public payable {
        address depositeeAddress = msg.sender;
        uint depositeeFunds = msg.value;

        require(isRegistered[depositeeAddress] != true, "A player can only deposit once.");
        require(depositeeFunds == uint(buyIn), "Deposit amount has to match the buy-in amount.");

        // hold an iterable record over registered players
        playersRegistered.push(depositeeAddress);
        
        isRegistered[depositeeAddress] = true;

        prizePool += depositeeFunds;
    }

    function getPlayerCount() public view returns (int) {
        return int(playersRegistered.length);
    }

    // Owner sends a list of winners arranged from first to last place
    function voteForWinner(address[] memory ballot) public payable ownerOnly {

        require(
            ballot.length == getPotiumSize(),
            "The amount of addresses in ballot has to match the potium size."
        );

        // TODO: Test this
        // Iterate through the potium starting with the lowest price payout
        for(uint i = getPotiumSize()-1; i >= 0; i--) {
            handOutReward(ballot[i], i);
        }
        /*
        for(uint i = 0; i < getPotiumSize(); i++) {
            handOutReward(listOfWinners[i], i);
        }
        */

        // TODO: Reset everything
    }


    function handOutReward(address playerAccount, uint place) public ownerOnly {

        require(isRegistered[playerAccount], "Player has to be registered.");

        uint prize = calculatePrize(place); 

        // The top player gets the "dust"
        if (place == 0) {
            prize = address(this).balance;
        }
        
        emit Payout(prize);

        playerAccount.transfer(prize);
    }

    function calculatePrize(uint place) public view returns (uint) {
        uint potiumSize = getPotiumSize();
        uint prizeMath = getPrizeCalculation();

        require(potiumSize >= place);
        require(prizeMath > 0);

        return prizePool * 2**(potiumSize - place) / prizeMath;
    }

    function getPrizeCalculation() public view returns (uint) {
        uint prizeMath;

        for (uint exponent = 1; exponent <= getPotiumSize(); exponent++) {
            prizeMath += 2**exponent;
        }
        return prizeMath;
    }

    /* 20% of all players get rewards */
    function getPotiumSize() public view returns (uint) {
        if (playersRegistered.length < 5) {
            return 1;
        }
        return playersRegistered.length / 5;
    }


}

