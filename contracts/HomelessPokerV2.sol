pragma solidity 0.5.6;


contract HomelessPokerV2 {
    
    uint public buyIn;
    uint public prizePool;
    uint public depositPool;
    uint public potiumSize;
    uint public roomSize;
    
    bytes32 private winningBallotHash;
    
    address[] public playersVoted;
    
    bool public votingHasStarted;
    bool public distributionHasEnded;
    
    struct Player {
        bytes32 username;
        bool hasVoted;
        bool isRegistered;
    }
    
    struct Candidate {
        uint voteCount;
        address[] voters;
        address[] potium;
    }
    
    mapping(address => Player) player;
    mapping(bytes32 => Candidate) candidates;

    constructor(bytes32 name, uint _roomSize) public payable {
        // require name
        buyIn = msg.value;
        roomSize = _roomSize;
        setPotiumSize(_roomSize);
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
    }
    
    function vote(address payable[] memory ballot) public {

        require(player[msg.sender].isRegistered == true, "Voter should be participating.");
        require(player[msg.sender].hasVoted == false, "Player should not vote again.");
        //require(player[msg.sender].ballot.length < 1, "A player can only vote once");
        
        require(
            ballot.length == potiumSize,
            "The amount of addresses in player ballot has to match the potium size."
        );
        
        votingHasStarted = true;
        player[msg.sender].hasVoted = true;
        playersVoted.push(msg.sender);
        
        bytes32 ballotHash = keccak256(abi.encodePacked(ballot));
        
        if(distributionHasEnded && ballotHash == winningBallotHash){
            uint depositHandout = depositPool / potiumSize;
            msg.sender.transfer(depositHandout);
        }
        else {
            candidates[ballotHash].voteCount += 1;
            candidates[ballotHash].voters.push(msg.sender);
            candidates[ballotHash].potium = ballot;
            
            if(candidates[ballotHash].voteCount > candidates[winningBallotHash].voteCount){
                winningBallotHash = ballotHash;
            }
            
            bool majorityVoted = majorityHasVoted(roomSize, playersVoted.length);
            
            if(majorityVoted) {
                distributePrizes(candidates[winningBallotHash].potium);
            }
        }
        
    }
    
    /* 20% of all players get rewards */
    function setPotiumSize(uint _roomSize) private returns (uint) {
        if(_roomSize % 5 == 0) {
            potiumSize = (_roomSize / 5);
        }
        else {
            potiumSize = (_roomSize / 5) + 1;
        }
    }
    
    function majorityHasVoted(uint registeredCount, uint votedCount) public pure returns (bool) {
        uint majority = getPercentage(registeredCount, 50) + 1;
        return votedCount >= majority;
    }
    
    function getPercentage(uint number, uint percent) public pure returns (uint) {
        return (number * percent) / 100;
    }
    
    function distributePrizes(address[] memory winningBallot) private {
        
        refundDeposits();

        uint slot;
        uint prize;
        address payable playerAccount;
        for(uint place = potiumSize; place > 0; place--) {
            slot = place - 1;
            playerAccount = address(uint(winningBallot[slot]));

            prize = getPrizeCalculation(place, potiumSize, prizePool);

            // The top player gets the "dust" + pledgePool if someone didn't vote
            // TODO: is this still needed ?
            if (place == 1) {
                prize = address(this).balance + depositPool;
            }

            prizePool = prizePool - prize;
            playerAccount.transfer(prize);
        }
        distributionHasEnded = true;
        delete slot;
        delete playerAccount; 
        delete prize;  // Comment out and see difference
    }
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPrizeCalculation(uint place, uint _potiumSize, uint pool) public pure returns (uint) {
        uint prizeMath;

        for (uint exp = 0; exp < _potiumSize; exp++) {
            prizeMath += 2**exp;
        }
        // x << y == x * 2**y
        return (pool << _potiumSize - place)/prizeMath;
    }
    
    function refundDeposits() private {
        uint depositHandout = depositPool / potiumSize;
        for (uint i = 0; i < candidates[winningBallotHash].voters.length; i++ ) {
            depositPool = depositPool - depositHandout;
            address(uint(candidates[winningBallotHash].voters[i])).transfer(depositHandout);
        }
    }

}