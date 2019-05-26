pragma solidity 0.5.6;


contract HomelessPoker {

    event DebugDistribution (uint place, uint prize, uint getContractBalance);
    event DebugDistribution2 (uint getContractBalance);
    event DebugMajorityHasVoted(address[] ballot);
    event DebugRefundDeposits(uint depositHandout, uint getContractBalance);

    uint public buyIn;
    uint public potiumSize;
    uint public roomSize;
    uint public timer;
    
    bytes32 private winningBallot;
    bytes32 private roomSecret;
    
    address[] public playersVoted;
    address[] public playersRegistered;

    bool public distributionHasEnded;
    bool public majorityVoted;

    struct Player {
        bytes32 username;
        bool hasVoted;
    }
    
    struct Candidate {
        uint voteCount;
        address[] voters;
        address[] ballot;
    }
    
    mapping(address => Player) public player;
    mapping(bytes32 => Candidate) public candidates;

    constructor(bytes32 name, uint _roomSize, bytes32 _roomSecret) public payable {
        require(name != 0, "You have to pick a username");
        buyIn = msg.value;
        roomSize = _roomSize;
        roomSecret = _roomSecret;
        setPotiumSize(_roomSize);
        register(name, _roomSecret);
    }

    function getPlayersVotedCount() external view returns (int) {
        return int(playersVoted.length);
    }

    function getPlayersRegistered() external view returns (address[] memory) {
        return playersRegistered;
    }

    function votingCanStart() external view returns (bool) {
        return playersRegistered.length == roomSize;
    }

    function getUsername(address account) external view returns (bytes32) {
        return player[account].username;
    }

    function register(bytes32 name, bytes32 _roomSecret) public payable {
        require(roomSecret == _roomSecret, "You have to have the right secret for this room");
        require(name != 0, "You have to pick a username");
        require(msg.value == buyIn, "Your value has to match the buy-in");
        require(playersRegistered.length+1 <= roomSize, "Room is full");
        require(player[msg.sender].username == 0, "You can only deposit once.");

        player[msg.sender].username = name;
        playersRegistered.push(msg.sender);
    }

    function vote(address payable[] memory ballot) public {
        require(playersRegistered.length == roomSize, "Can't start voting, not everybody is signed up");
        require(player[msg.sender].username != 0, "You can't vote if you're not participating.");
        require(player[msg.sender].hasVoted == false, "You can't vote again.");

        require(
            ballot.length == potiumSize,
            "The amount of players in ballot has to match the potium size."
        );

        player[msg.sender].hasVoted = true;
        playersVoted.push(msg.sender);

        bytes32 voted = keccak256(abi.encodePacked(ballot));

        // Give players opertunity to vote correctly and get their deposits back.
        if(distributionHasEnded) {
            require(voted == winningBallot, "Vote has to match the top candidate");
            msg.sender.transfer(getPercentage(buyIn, 5)); 
        }
        else {
            candidates[voted].voteCount += 1;
            candidates[voted].voters.push(msg.sender);
            candidates[voted].ballot = ballot;

            if ( candidates[voted].voteCount > candidates[winningBallot].voteCount ) {
                winningBallot = voted;
            }

            setMajorityVoted(roomSize, playersVoted.length);

            timer = now;

            if(majorityVoted) {
                emit DebugMajorityHasVoted(candidates[winningBallot].ballot);
                distributePrizes(candidates[winningBallot].ballot);
            }
        }
    }

    function killswitch() public {
        require(player[msg.sender].username != 0, "Player has to be registered to kill contract");
        if(playersRegistered.length == roomSize) {
            require(!majorityVoted, "Can not kill contract when majority has voted");
            require(now > timer+3600, "An hour must have passed since last vote");
            require(timer != uint(0), "Can not kill a contract with everyone registered and no votes");
        }
        for(uint i = 0; i < playersRegistered.length; i++) {
            address(uint(playersRegistered[i])).transfer(buyIn);
        }
    }
    
    function getPercentage(uint number, uint percent) public pure returns (uint) {
        return (number * percent) / 100;
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

    function setMajorityVoted(uint registeredCount, uint votedCount) private {
        majorityVoted = votedCount >= getPercentage(registeredCount, 50) + 1;
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

    function distributePrizes(address[] memory winners) private {

        // TODO: send an event with the winning bracket

        refundDeposits();

        uint slot;
        uint prize;
        address payable playerAccount;
        for(uint place = potiumSize; place > 0; place--) {
            slot = place - 1;
            playerAccount = address(uint(winners[slot]));

            prize = getPrizeCalculation(place, potiumSize, getPercentage(buyIn*roomSize, 95));

            emit DebugDistribution(place, prize, getContractBalance());
            distributionHasEnded = true;
            playerAccount.transfer(prize);
        }
        emit DebugDistribution2(getContractBalance());
    }

    function refundDeposits() private {
        uint depositHandout = getPercentage(buyIn, 5);

        emit DebugRefundDeposits(depositHandout, getContractBalance());

        for (uint i = 0; i < candidates[winningBallot].voters.length; i++ ) {
            address(uint(candidates[winningBallot].voters[i])).transfer(depositHandout);
        }
    }
}