pragma solidity ^0.4.25;

// https://github.com/MeadowSuite/Meadow/wiki/Using-the-VSCode-Solidity-Debugger



contract PokerTournament {
    uint public buyIn;
    uint public deposit;
    uint public prizePool;
    uint public depositPool;
    bool public votingHasStarted;
    address[] private playersRegistered;
    address[] private playersVoted;

    mapping(address => bool) private isRegistered;
    mapping(address  => address[]) private ballot;
    mapping(address => uint) private count;

    event LogDeposit (address sender, uint amount, uint balance);
    event LogRefund (uint deposit, uint depositPool);
    event LogDeposit2 (uint buyIn, uint deposit);
    event LogHandout (uint potiumSize, uint prizeCalculation, uint place );
    event LogHandout2 (uint prize, uint prizePool);
    event LogVoting (uint prizePool, bool hasEverybodyVoted);
    event LogTest (uint contractBalance);
    event LogPrize (uint prize);
    event LogCalc (uint prizePool, uint i, uint prizeMath);

    /* solhint-disable no-empty-blocks */
    constructor() public payable {
        // TODO: Initiate tournament instance ID
    }
    /* solhint-enable no-empty-blocks */

    function test(uint number) public pure returns (uint) {
        return number * 1 / 4;
    }

    function deposit() public payable {
        address depositeeAddress = msg.sender;
        uint depositeeFunds = msg.value;
        require(votingHasStarted == false, "Voting started, registration has ended");
        require(!isRegistered[depositeeAddress], "A player can only deposit once.");

        /* First depositee sets the buy-in amount */
        if (playersRegistered.length == 0) {
            setBuyInAndDeposit(depositeeFunds);
        }
        else {
            require(depositeeFunds == (buyIn + deposit), "Value sent to contract has to match the buy-in + deposit amount.");
        }

        depositPool += deposit;
        prizePool += buyIn;
        emit LogDeposit2(buyIn, deposit); 
        playersRegistered.push(depositeeAddress);
        isRegistered[depositeeAddress] = true;

        //emit LogDeposit(msg.sender, msg.value, msg.sender.balance);
    }

    function getPlayerCount() public view returns (int) {
        return int(playersRegistered.length);
    }

    function transferDepositBack() public {
        for(uint i = 0; i < playersVoted.length; i++ ) {
            playersVoted[i].transfer(deposit);
            depositPool -= deposit;
        }
    }

    // First iteration will trust that every player votes correctly:
    // player sends in a listOfWinners array arranged from first to last place
    function voteForWinner(address[] memory playerBallot) public payable {
        votingHasStarted = true;
        emit LogVoting(prizePool, allPlayersHaveVoted());
        address depositeeAddress = msg.sender;
        require(isRegistered[depositeeAddress] == true, "Voter should be participating.");
        require(ballot[depositeeAddress].length < 1, "A player can only vote once");
        require(
            playerBallot.length == getPotiumSize(),
            "The amount of addresses in player ballot has to match the potium size."
        );

        // mapping a players ballot (kjörseðill) to his address
        ballot[depositeeAddress] = playerBallot; 
    
        // maintain an iterable record for who has voted
        playersVoted.push(msg.sender);

        refundDeposit(msg.sender);

        if (votingEnded()) {
            handOutReward();
            // TODO: selfdestruct
        }
        // else if(timedOut()) {
        //     // selfdestruct() ?
        // }
    }
    function votingEnded() public view returns (bool) {
        if(allPlayersHaveVoted() || (majorityHasVoted() && timedOut())) {
            return true;
        }
        return false;
    }
    function refundDeposit(address sender) public {
        emit LogRefund(deposit, depositPool);
        sender.transfer(deposit);
        depositPool -= deposit;
    }

    function timedOut() public pure returns (bool) {
        // TODO: After 2 blocks, return true
        return false;
    }

    function majorityHasVoted() public view returns (bool) {
        // uint() floors integers, add one to get ceiling.
        uint majority = uint(playersRegistered.length * 1 / 2) + 1;
        return playersVoted.length >= majority;
    }

    function isEqual(address[] ballotOne, address[] ballotTwo) public pure returns (bool) {
        return keccak256(abi.encodePacked(ballotOne)) == keccak256(abi.encodePacked(ballotTwo));
    }

    function getWinningBallot() public view returns (address[]) {

        uint max = 0;
        address[] memory winningBallot;
        address[] memory thisBallot;
        address[] memory restOfBallots;

        for(uint i = 0; i < playersVoted.length; i++ ) {
            uint counter = 0;
            thisBallot = ballot[playersVoted[i]];
            for(uint j = i + 1; j < playersVoted.length; j) {
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

    function calculatePrize(uint place) public view returns (uint) {
        // require(potiumSize >= place);
        // require(prizeMath > 0);

        uint potiumSize = getPotiumSize();
        uint prizeMath = getPrizeCalculation();

        return prizePool * 2**(potiumSize - place) / prizeMath;
    } 

    function handOutReward() public payable {
        address[] memory winningBallot = getWinningBallot();
        for(uint place = uint(getPotiumSize() - 1); place >= 0; place--) {
            address playerAccount = winningBallot[place];

            emit LogHandout(getPotiumSize(), getPrizeCalculation(), place);

            require(isRegistered[playerAccount], "Player has to be registered.");
            // uint prize = 10;
            uint prize = calculatePrize(place); 

            // The top player gets the "dust" + depositPool if someone didn't vote
            if (place == 0) {
                prize = (getContractBalance() + depositPool);
            }

            emit LogHandout2(prize, prizePool);

            playerAccount.transfer(prize);
        }
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPrizeCalculation() public view returns (uint) {
        uint prizeMath;

        for (uint exponent = 1; exponent <= getPotiumSize(); exponent++) {
            prizeMath += 2**exponent;
        }
        return prizeMath;
    }

    function getPlayerBallot() public view returns (address[] memory) {
        return ballot[msg.sender];
    }
  
    function getPlayersVotedCount() public view returns (int) {
        return int(playersVoted.length);
    }

    /* 20% of all players get rewards */
    function getPotiumSize() public view returns (uint) {
        if (playersRegistered.length < 5) {
            return 1;
        }
        return playersRegistered.length / 5;
    }

    function allPlayersHaveVoted() private view returns (bool) {
        return (playersRegistered.length == playersVoted.length);
    }

    function setBuyInAndDeposit(uint amount) private {
        require(amount >= 0, "The buy-in amount has to be positive.");
        uint depositAmount = amount * 1 / 4;

        deposit = depositAmount;
        buyIn = amount - depositAmount;
    }
}

