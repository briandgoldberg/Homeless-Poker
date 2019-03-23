pragma solidity ^0.5.4;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract HomelessPoker {

    using SafeMath for uint;
    uint public buyIn;
    uint public pledge;
    uint public prizePool;
    uint public pledgePool;
    bool public votingHasStarted;
    address[] public playersRegistered;
    address payable[] private playersVoted;
    address payable[] private playersVotedCorrectly;
    uint public lastVote;

    mapping(address => bool) private isRegistered; // TODO: move this to player struct
    mapping(address => address payable[]) private ballot;
    mapping(address => uint) private count;

    event LogDeposit (address sender, uint amount, uint balance);
    event LogRefund (uint deposit, uint pledgePool, uint contractBalance);
    event LogDeposit2 (uint buyIn, uint deposit);
    event LogHandout (uint prize, uint prizePool);
    event LogVoting (uint prizePool, bool hasEverybodyVoted);
    event LogPrize (uint prize);
    event LogCalc (uint prizePool, uint i, uint prizeMath);
    event LogSelfDestruct (address sender, uint accountBalance);

    function deposit() public payable {
        require(votingHasStarted == false, "Voting started, registration has ended");
        require(!isRegistered[msg.sender], "A player can only deposit once.");

        /* First depositee sets the buy-in amount */
        if (playersRegistered.length == 0) {
            setBuyIn(msg.value);
        }
        else {
            require(msg.value == (buyIn + pledge), "Value sent has to match the buy-in + deposit amount.");
        }

        pledgePool = pledgePool.add(pledge);
        prizePool = prizePool.add(buyIn);
        emit LogDeposit2(buyIn, pledge);
        playersRegistered.push(msg.sender);
        isRegistered[msg.sender] = true;

        //emit LogDeposit(msg.sender, msg.value, msg.sender.balance);
    }

    function getPlayerCount() public view returns (int) {
        return int(playersRegistered.length);
    }

    function getPlayersVotedCount() public view returns (int) {
        return int(playersVoted.length);
    }

    // First iteration will trust that every player votes correctly:
    // player sends in a listOfWinners array arranged from first to last place
    function vote(address payable[] memory playerBallot) public payable {
        votingHasStarted = true;
        emit LogVoting(prizePool, allPlayersHaveVoted());
        require(isRegistered[msg.sender] == true, "Voter should be participating.");
        require(ballot[msg.sender].length < 1, "A player can only vote once");
        require(
            playerBallot.length == getPotiumSize(),
            "The amount of addresses in player ballot has to match the potium size."
        );

        // mapping a players ballot (kjörseðill) to his address
        ballot[msg.sender] = playerBallot;
    
        // maintain an iterable record for who has voted
        playersVoted.push(msg.sender);

        // set a time
        lastVote = now;


        if (votingEnded()) {
            resolve();
        }
    }

    // trigger activated 1h after last vote
    function trigger() public {
        require(lastVote.add(3600) > now, "1h has to pass since last vote");
        resolve();
    }

    function votingEnded() public view returns (bool) {
        return allPlayersHaveVoted() ? true : false;
    }

    function getPercentage(uint number, uint percent) public pure returns (uint) {
        return number.mul(percent).div(100);
    }

    function isEqual(address payable[] memory ballotOne, address payable[] memory ballotTwo) 
    public pure returns (bool) {
        return keccak256(abi.encodePacked(ballotOne)) == keccak256(abi.encodePacked(ballotTwo));
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPrizeCalculation(uint place, uint potiumSize, uint pool) public pure returns (uint) {
        uint prizeMath;

        for (uint exp = 0; exp < potiumSize; exp++) {
            prizeMath += 2**exp;
        }
        // x << y == x * 2**y
        uint prize = (pool << potiumSize.sub(place)).div(prizeMath);

        return prize;
    }

    /* 20% of all players get rewards */
    function getPotiumSize() public view returns (uint) {
        if (playersRegistered.length < 5) {
            return 1;
        }
        else if (playersRegistered.length.mod(5) == 0) {
            return uint(playersRegistered.length.div(5));
        }
        return uint(playersRegistered.length.div(5)).add(1);
    }

    function resolve () private {
        handOutReward();
        emit LogSelfDestruct(msg.sender, address(this).balance);
        selfdestruct(msg.sender);
    }

    // this function takes tons of gas, the last player to vote
    // uses almost 300.000 additional gas
    function getWinningBallot() private view returns (address payable[] memory) {

        uint8 max = 0;
        address payable[] memory winningBallot;
        address payable[] memory thisBallot;
        address payable[] memory restOfBallots;

        for(uint8 i = 0; i < playersVoted.length; i++ ) {
            uint8 counter = 0;
            thisBallot = ballot[playersVoted[i]];

            for(uint8 j = 1; j < playersVoted.length; j++) {
                restOfBallots = ballot[playersVoted[j]];
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

    function refundPledge(address payable[] memory winningBallot) private {
        for ( uint i = 0; i < playersVoted.length; i++ ) {
            if (isEqual(ballot[playersVoted[i]], winningBallot)) {
                playersVotedCorrectly.push(playersVoted[i]);
            }
        }
        uint pledgeHandout = pledgePool.div(playersVotedCorrectly.length);
        for ( uint i = 0; i < playersVotedCorrectly.length; i++) {
            pledgePool = pledgePool.sub(pledgeHandout);
            playersVotedCorrectly[i].transfer(pledgeHandout);
        }
    }

    function handOutReward() private {
        address payable[] memory winningBallot = getWinningBallot();

        refundPledge(winningBallot); // TODO test

        for(uint place = getPotiumSize(); place > 0; place--) {
            uint slot = place.sub(1);
            address payable playerAccount = winningBallot[slot];

            require(isRegistered[playerAccount], "Player has to be registered.");
            uint prize = getPrizeCalculation(place, getPotiumSize(), prizePool);

            // The top player gets the "dust" + pledgePool if someone didn't vote
            if (place == 1) {
                prize = getContractBalance().add(pledgePool);
            }

            emit LogHandout(prize, prizePool);
            prizePool = prizePool.sub(prize);
            playerAccount.transfer(prize);
        }
    }

    // function refundDeposit(address payable sender) private {
    //     pledgePool = pledgePool.sub(pledge);
    //     sender.transfer(pledge);
    //     emit LogRefund(pledge, pledgePool, getContractBalance());
    // }

    function setBuyIn(uint amount) private {
        // uint pledgeAmount = getPercentage(amount, 25);
        uint pledgeAmount = amount == 0 ? 0 : 0.01 ether;
        pledge = pledgeAmount;
        buyIn = amount.sub(pledgeAmount);
    }

    function transferDepositBack() private {
        for(uint i = 0; i < playersVoted.length; i++ ) {
            pledgePool = pledgePool.sub(pledge);
            playersVoted[i].transfer(pledge);
        }
    }

    function allPlayersHaveVoted() private view returns (bool) {
        return (playersRegistered.length == playersVoted.length);
    }

}

