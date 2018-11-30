pragma solidity >=0.4.0 <0.6.0;

// https://github.com/MeadowSuite/Meadow/wiki/Using-the-VSCode-Solidity-Debugger

contract PokerTournament {
    
    struct Player {
        address wallet;
        uint nickname;
    }
    
    int     buyIn;
    int     prizePool;
    address public depositeeAddress;
    address[] registeredPlayers;
    
    mapping(address => Player) players;
    
    constructor() public {
        depositeeAddress = msg.sender;
    }
    
    function setBuyIn(int amount) public {
        // first deposit sets the buy-in?
        require(amount >= 0, "The buy-in amount has to be positive.");
        buyIn = amount;
    }

    function getBuyIn() public view returns (int) {
        return buyIn;
    }

    // payable -> can send Ether to contract
    function deposit (int amount) public payable {
        //address depositeeAddress = msg.sender;
        uint    depositeeFunds = msg.sender.balance;
        
        require(depositeeFunds > uint(amount), "Depositee has to afford the transfer");
        require(players[depositeeAddress].wallet == address(0), "A player can only deposit once.");

        /* First depositee controls the buy-in amount */
        if (getPlayerCount() == 0) {
            setBuyIn(amount);
        }
        require(amount == getBuyIn(), "Deposit amount has to match the buy-in amount");

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

