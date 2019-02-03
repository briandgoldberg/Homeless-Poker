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
        emit LogDeposit(msg.sender, msg.value, msg.sender.balance); 
        address depositeeAddress = msg.sender;
        uint depositeeFunds = msg.value;
        require(votingHasStarted == false, "Registration has ended");
        require(isRegistered[depositeeAddress] == false, "A player can only deposit once.");

        /* First depositee sets the buy-in amount */
        if (playersRegistered.length == 0) {
            setBuyInAndDeposit(depositeeFunds);
        }
        else {
            require(depositeeFunds == uint(buyIn+deposit), "Deposit amount has to match the buy-in + deposit amount.");
        }

        depositPool += deposit;
        prizePool += buyIn;

        playersRegistered.push(depositeeAddress);
        isRegistered[depositeeAddress] = true;
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
    function voteForWinner(address[] memory listOfWinners) public payable {
        votingHasStarted = true;
        emit LogVoting(prizePool, allPlayersHaveVoted());
        address depositeeAddress = msg.sender;
        require(isRegistered[depositeeAddress] == true, "Voter should be participating.");

        require(ballot[depositeeAddress].length < 1, "A player can only vote once");
        require(
            listOfWinners.length == getPotiumSize(),
            "The amount of addresses in player ballot has to match the potium size."
        );

        // mapping a players ballot (kjörseðill) to his address
        ballot[msg.sender] = listOfWinners; 
    
        // maintain an iterable record for who has voted
        playersVoted.push(msg.sender);

        if (allPlayersHaveVoted() || timedOut()) {

            transferDepositBack();

            if (majorityHasVoted()) {
                // address[] memory winningBallot = getWinningBallot();
                
                // Færa inn í handOutRewards?
                for(uint place = getPotiumSize()-1; place >= 0; place--) {
                    handOutReward(getWinningBallot()[place], place);
                }
                // for(uint place = 0; place < getPotiumSize(); place++) {
                //     handOutReward(listOfWinners[place], place);
                // }
            }
            // TODO: selfDestruct
            prizePool = 0;
        }
    }

    function timedOut() public pure returns (bool) {
        // TODO Timeout á deposit
        return false;
    }

    function majorityHasVoted() public view returns (bool) {
        // uint() floors integers, add one to get ceiling.
        uint majority = uint(playersRegistered.length * 1 / 2) + 1;
        return playersVoted.length >= majority;
    }

    function getWinningBallot() public view returns (address[]) {

        uint max = 0;
        address[] memory winningBallot;
        address[] memory thisBallot;
        address[] memory nextBallot;

        for(uint i = 0; i < playersVoted.length; i++ ) {
            uint counter = 0;
            thisBallot = ballot[playersVoted[i]];
            for(uint j = i + 1; j < playersVoted.length; ) {
                nextBallot = ballot[playersVoted[j]];

                bool isMatch;
                // https://ethereum.stackexchange.com/questions/51846/compare-memory-pointers-in-solidity
                assembly {
                    isMatch := eq(thisBallot, nextBallot)
                }
                if (isMatch) {
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
        uint potiumSize = getPotiumSize();
        uint prizeMath = getPrizeCalculation();

        require(potiumSize >= place);
        require(prizeMath > 0);

        return prizePool * 2**(potiumSize - place) / prizeMath;
    }

    function handOutReward(address playerAccount, uint place) public payable {
        emit LogHandout(getPotiumSize(), getPrizeCalculation(), place);

        require(isRegistered[playerAccount] == true, "Player has to be registered.");

        uint prize = calculatePrize(place); 

        // The top player gets the "dust" + depositPool if someone didn't vote
        if (place == 0) {
            prize = getContractBalance() + depositPool;
        }

        emit LogHandout2(prize, prizePool);

        playerAccount.transfer(prize);
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
        return (playersRegistered.length == playersVoted.length) ? true : false;
    }

    function setBuyInAndDeposit(uint amount) private {
        require(amount >= 0, "The buy-in amount has to be positive.");
        uint depositAmount = amount * 1 / 4;

        deposit = depositAmount;
        buyIn = amount - depositAmount;
    }
}

