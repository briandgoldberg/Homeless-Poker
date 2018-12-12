pragma solidity >=0.4.10 <0.6.0;

// https://github.com/MeadowSuite/Meadow/wiki/Using-the-VSCode-Solidity-Debugger

contract PokerTournament {
    
    // TODO: make variables public, solidity automaticly create get functions.
    uint     buyIn;
    uint     prizePool;
    address payable[] registeredPlayers;
    address[] playersVoted;
    
    
    mapping(address => uint) playerBalance;
    mapping(address => address[]) ballot;
    
    constructor() public {
        // TODO: accept tournament instance ID
    }
    
    function setBuyIn(uint amount) private {
        require(amount >= 0, "The buy-in amount has to be positive.");
        buyIn = amount;
    }

    function getBuyIn() public view returns (int) {
        return int(buyIn);
    }

    // payable -> can send Ether to contract
    function deposit () public payable {
        address payable depositeeAddress = msg.sender;
        uint depositeeFunds = msg.value;

        require(depositeeAddress.balance > depositeeFunds, "Player has to affford the buy-in");
        require(playerBalance[depositeeAddress] == uint(0), "A player can only deposit once.");

        /* First depositee controls the buy-in amount */
        if (getPlayerCount() == 0) {
            setBuyIn(depositeeFunds);
        }
        else {
            require(depositeeFunds == uint(getBuyIn()), "Deposit amount has to match the buy-in amount");
        }
        // hold a record over registered players
        registeredPlayers.push(depositeeAddress);
        
        // holds a record of balance tied to an address, possibly not needed
        playerBalance[depositeeAddress] += depositeeFunds;

        addToPrizePool(depositeeFunds);
    }

    function getPlayerCount() public view returns (int) {
        return int (registeredPlayers.length);
    }

    function addToPrizePool(uint amount) private returns (uint){
        return prizePool += amount;
    }

    function getPrizePool() public view returns (int) {
        return int(prizePool);
    }

    // First iteration will trust that every player votes correctly:

    // player sends in a listOfWinners array arrange from first to last place
    function voteForWinner(address[] memory listOfWinners) public  {
    
        /// require: ballot[msg.sender] == address[](0)??
        /// require: amount of addresses in listOfWinners to be 20% total amount players
    
        // mapping a players ballot (kjörseðill) to his address
        ballot[msg.sender] = listOfWinners; 
    
        // maintain an iterable record for who has voted
        playersVoted.push(msg.sender);
    }

    function getPlayerBallot() public view returns (address[] memory) {
        return ballot[msg.sender];
    }
  
    function getPlayersVotedCount() public view returns (int) {
        return int(playersVoted.length);
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

