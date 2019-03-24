pragma solidity ^0.5.6;


contract HomelessPoker {
    
    uint public buyIn;
    uint public prizePool;
    uint public depositPool;
    address[] public playersRegistered;
    
    struct Player {
        bytes32 username; // convert this to bytes32 and use fromAscii to send strings
        address[] ballot;
        bool hasVoted;
        bool isRegistered;
    }
    
    mapping(address => Player) player;

    constructor(bytes32 name) public payable {
        // require name
        buyIn = msg.value;
        participate(name);
    }
    
    function participate(bytes32 name) public payable {
     
        // require name
        // require msg.value == buyIn
        uint deposit = (msg.value * 5)/100;
        depositPool += deposit;
        prizePool += msg.value-deposit;
        
        player[msg.sender].username = name;
        player[msg.sender].isRegistered = true;
        
        playersRegistered.push(msg.sender);
    }

}