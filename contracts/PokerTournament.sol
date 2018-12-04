pragma solidity >=0.4.0 <0.6.0;

// https://github.com/MeadowSuite/Meadow/wiki/Using-the-VSCode-Solidity-Debugger

contract PokerTournament {
    
    uint     buyIn;
    uint     prizePool;
    address[] registeredPlayers;
    
    mapping(address => uint) players;
    
    constructor() public {
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
        address depositeeAddress = msg.sender;
        uint depositeeFunds = msg.value;

        require(players[depositeeAddress] == uint(0), "A player can only deposit once.");

        /* First depositee controls the buy-in amount */
        if (getPlayerCount() == 0) {
            setBuyIn(depositeeFunds);
        }
        else {
            require(depositeeFunds == uint(getBuyIn()), "Deposit amount has to match the buy-in amount");
        }
        registeredPlayers.push(depositeeAddress);

        players[depositeeAddress] += depositeeFunds;

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
}

