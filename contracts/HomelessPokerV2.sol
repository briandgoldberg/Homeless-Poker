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
        bytes32 username;
        address payable[] ballot;
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
            address payable[] memory winningBallot = getWinningBallot();
            distributePrizes(winningBallot);
            delete winningBallot; // does this work?
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
    
    function distributePrizes(address payable[] memory winningBallot) private {
        
        //refundPledge(winningBallot); // TODO test
        uint slot;
        uint prize;
        address payable playerAccount;
        for(uint place = potiumSize; place > 0; place--) {
            slot = place - 1;
            playerAccount = winningBallot[slot];

            require(player[playerAccount].isRegistered, "Player has to be registered.");
            prize = getPrizeCalculation(place, potiumSize, prizePool);

            // The top player gets the "dust" + pledgePool if someone didn't vote
            // TODO: is this still needed ?
            if (place == 1) {
                prize = address(this).balance + depositPool;
            }

            prizePool = prizePool - prize;
            playerAccount.transfer(prize);
        }
        delete slot; // DOES THIS DO ANYTHING?
        delete playerAccount; // ?
        delete prize;  // Comment out and see difference
    }
    
    function getWinningBallot() private view returns (address payable[] memory) {

        uint8 max = 0;
        address payable[] memory winningBallot;
        address payable[] memory thisBallot;
        address payable[] memory restOfBallots;

        for(uint8 i = 0; i < playersVoted.length; i++ ) {
            uint8 counter = 0;
            thisBallot = player[playersVoted[i]].ballot;

            for(uint8 j = 1; j < playersVoted.length; j++) {
                restOfBallots = player[playersVoted[j]].ballot;
                if (isEqual(thisBallot, restOfBallots)) {
                    counter += 1;
                }
            }
            if(counter > max) {
                max = counter;
                winningBallot = thisBallot;
            }
        }
        return winningBallot;
    }

    function getPrizeCalculation(uint place, uint _potiumSize, uint pool) public pure returns (uint) {
        uint prizeMath;

        for (uint exp = 0; exp < _potiumSize; exp++) {
            prizeMath += 2**exp;
        }
        // x << y == x * 2**y
        return (pool << _potiumSize - place)/prizeMath;
    }
    
    function isEqual(address payable[] memory ballotOne, address payable[] memory ballotTwo) 
    public pure returns (bool) {
        return keccak256(abi.encodePacked(ballotOne)) == keccak256(abi.encodePacked(ballotTwo));
    }
}