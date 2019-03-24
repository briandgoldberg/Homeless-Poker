pragma solidity ^0.5.6;


contract HomelessPoker {
    
    uint public buyIn;
    uint public prizePool;
    uint public depositPool;
    uint public potiumSize;
    address[] public playersRegistered;
    address[] public playersVoted;
    
    bool votingHasStarted;
    
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
        require(votingHasStarted == false, "Voting started, registration has ended");
        require(msg.value == buyIn, "Value has to match buyIn");
        require(!player[msg.sender].isRegistered, "A player can only deposit once.");
        
        uint deposit = (msg.value * 5)/100;
        depositPool += deposit;
        prizePool += msg.value-deposit;
        
        player[msg.sender].username = name;
        player[msg.sender].isRegistered = true;
        
        playersRegistered.push(msg.sender); // needed ?
    }
    
    function vote(address payable[] memory ballot) public {

        
        require(player[msg.sender].isRegistered == true, "Voter should be participating.");
        require(player[msg.sender].ballot.length < 1, "A player can only vote once");
        
        setPotiumSize(playersRegistered.length);
        require(
            ballot.length == potiumSize,
            "The amount of addresses in player ballot has to match the potium size."
        );
        
        votingHasStarted = true;
        
        player[msg.sender].ballot = ballot;
        player[msg.sender].hasVoted = true;
        
        playersVoted.push(msg.sender);
        
        bool majorityVoted = majorityHasVoted(playersRegistered.length, playersVoted.length);
        
        if(majorityVoted) {
            // TODO handOutRewards
        }
        
    }
    
    /* 20% of all players get rewards */
    function setPotiumSize(uint playersRegisteredCount) public returns (uint) {
        if(playersRegisteredCount % 5 == 0) {
            potiumSize = (playersRegisteredCount / 5);
        }
        else {
            potiumSize = (playersRegisteredCount / 5) + 1;
        }
    }
    
    function majorityHasVoted(uint registeredCount, uint votedCount) public pure returns (bool) {
        uint majority = getPercentage(registeredCount, 50) + 1;
        return votedCount >= majority;
    }
    
    function getPercentage(uint number, uint percent) public pure returns (uint) {
        return (number * percent) / 100;
    }

}