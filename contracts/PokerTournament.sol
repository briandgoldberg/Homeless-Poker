pragma solidity 0.4.25;

// https://github.com/MeadowSuite/Meadow/wiki/Using-the-VSCode-Solidity-Debugger

contract PokerTournament {
    uint public buyIn;
    uint public prizePool;
    address[] private playersRegistered;
    address[] private playersVoted;

    mapping(address => uint) private playerBalance;
    mapping(address => address[]) private ballot;

    /* solhint-disable no-empty-blocks */
    constructor() public {
        // TODO: Initiate tournament instance ID
    }
    /* solhint-enable no-empty-blocks */

    function deposit() public payable {

        address depositeeAddress = msg.sender;
        uint depositeeFunds = msg.value;

        require(depositeeAddress.balance > depositeeFunds, "Player has to affford the buy-in");
        require(playerBalance[depositeeAddress] == uint(0), "A player can only deposit once.");

        /* First depositee controls the buy-in amount */
        if (playersRegistered.length == 0) {
            setBuyIn(depositeeFunds);
        }
        else {
            require(depositeeFunds == uint(buyIn), "Deposit amount has to match the buy-in amount");
        }
        // hold a record over registered players
        playersRegistered.push(depositeeAddress);
        
        // holds a record of balance tied to an address, possibly not needed
        playerBalance[depositeeAddress] += depositeeFunds;

        addToPrizePool(depositeeFunds);
    }

    function getPlayerCount() public view returns (int) {
        return int(playersRegistered.length);
    }

    // First iteration will trust that every player votes correctly:
    // player sends in a listOfWinners array arrange from first to last place
    function voteForWinner(address[] memory listOfWinners) public {
    
        /// require: playersVoted[msg.sender] == address(0)
        /// require: amount of addresses in listOfWinners to be 20% of total amount players
    
        // mapping a players ballot (kjörseðill) to his address
        ballot[msg.sender] = listOfWinners; 
    
        // maintain an iterable record for who has voted
        playersVoted.push(msg.sender);

        /* solhint-disable no-empty-blocks */
        if (allPlayersHaveVoted()) {
            //TODO: calculate and send to winners
        }
        /* solhint-enable no-empty-blocks */
    }

    function getPlayerBallot() public view returns (address[] memory) {
        return ballot[msg.sender];
    }
  
    function getPlayersVotedCount() public view returns (int) {
        return int(playersVoted.length);
    }

    // 20% of all players get rewards
    function getPotiumSize() public view returns (uint) {
        return playersRegistered.length / 5;
    }

    function allPlayersHaveVoted() private view returns (bool) {
        return (playersRegistered.length == playersVoted.length) ? true : false;
    }

    function setBuyIn(uint amount) private {
        require(amount >= 0, "The buy-in amount has to be positive.");
        buyIn = amount;
    }

    function addToPrizePool(uint amount) private returns (uint) {
        return prizePool += amount;
    }


    /*
    function handOutRewards(address payable firstPlace) public returns (uint) {
        require(playerBalance[firstPlace] != uint(0), "Player has to be registered.");

        uint prizeMath = 2**0 + 2**1 + 2**2 + 2**3;
        uint firstPlacePrize = 2**3 / prizeMath * 20;

        uint accountBalance = firstPlace.balance;
        firstPlace.transfer(10);
        require(firstPlace.balance+10 >= accountBalance, "amount was transferred");

        return uint(firstPlace.balance);
    }
    */

}

