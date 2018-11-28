pragma solidity >=0.4.0 <0.6.0;

// https://ethereum.stackexchange.com/questions/12097/creating-dynamic-arrays

contract PokerTournament {
    
    address[] playerAddresses;
    
    struct Player {
        address account;
    }
    
    int buyIn = 0;
    int prizePool;
    address depositeeAddress;
    
    mapping(address => Player) players;
    
    constructor() public {
        depositeeAddress = msg.sender;
    }
    
    function setBuyIn(int amount) public {
        // todo: only admin can set buy-in
        require(amount >= 0, "The buy-in amount has to be a positive.");
        buyIn = amount;
    }
    function getBuyIn() public view returns (int) {
        return buyIn;
    }
    
    // payable -> can send Ether to contract
    function deposit() public payable {
        // todo: check if account has buyIn amount
        require(players[depositeeAddress].account == address(0), "A player can only deposit once.");
        players[depositeeAddress].account = depositeeAddress;
        playerAddresses.push(depositeeAddress);
        
        prizePool += buyIn;

    }
    
    function getPlayerCount() public view returns (uint) {
        return playerAddresses.length;
    }
    
    function getPrizePool() public view returns (int) {
        return prizePool;
    }
}

