pragma solidity >=0.4.0 <0.6.0;

// https://ethereum.stackexchange.com/questions/12097/creating-dynamic-arrays

contract PokerTournament {
    
    struct Player {
        address wallet;
        uint nickname;
    }
    
    int buyIn = 0;
    int prizePool = 0;
    address depositeeAddress;
    address[] registeredPlayers;
    
    mapping(address => Player) players;
    
    constructor() public {
        depositeeAddress = msg.sender;
    }
    
    function setBuyIn(int amount) public {
        // todo: only admin can set buy-in
        require(amount >= 0, "The buy-in amount has to be positive.");
        buyIn = amount;
    }
    function getBuyIn() public view returns (int) {
        return buyIn;
    }
    
    // payable -> can send Ether to contract
    function deposit() public payable {
        // todo: check if address has buyIn amount
        require(players[depositeeAddress].wallet == address(0), "A player can only deposit once.");

        players[depositeeAddress].wallet = depositeeAddress;
        registeredPlayers.push(depositeeAddress);
        
        prizePool += buyIn;

    }
    
    function getPlayerCount() public view returns (uint) {
        return registeredPlayers.length;
    }
    
    function getPrizePool() public view returns (int) {
        return prizePool;
    }
}

