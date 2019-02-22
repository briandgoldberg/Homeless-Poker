pragma solidity ^0.5.4;


import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract PokerTournament {
    using SafeMath for uint;
    uint public _buyIn;
    uint public _deposit;
    uint public prizePool;
    uint public depositPool;
    bool public votingHasStarted;
    address[] private playersRegistered;
    address payable[] private playersVoted;

    mapping(address => bool) private isRegistered;
    mapping(address => address payable[]) private ballot;
    mapping(address => uint) private count;

    event LogDeposit (address sender, uint amount, uint balance);
    event LogRefund (uint deposit, uint depositPool, uint contractBalance);
    event LogDeposit2 (uint _buyIn, uint deposit);
    event LogHandout (uint prize, uint prizePool);
    event LogVoting (uint prizePool, bool hasEverybodyVoted);
    event LogPrize (uint prize);
    event LogCalc (uint prizePool, uint i, uint prizeMath);

    /* solhint-disable no-empty-blocks */
    constructor() public payable {
        // TODO: Initiate tournament instance ID
    }
    /* solhint-enable no-empty-blocks */

    function deposit() public payable {
        address depositeeAddress = msg.sender;
        uint256 depositeeFunds = msg.value;
        require(votingHasStarted == false, "Voting started, registration has ended");
        
        // is this working? 
        require(!isRegistered[depositeeAddress], "A player can only deposit once.");

        /* First depositee sets the buy-in amount */
        if (playersRegistered.length == 0) {
            setBuyInAndDeposit(depositeeFunds);
        }
        else {
            require(depositeeFunds == (_buyIn + _deposit), "Value sent has to match the buy-in + deposit amount.");
        }

        depositPool = depositPool.add(_deposit);
        prizePool = prizePool.add(_buyIn);
        emit LogDeposit2(_buyIn, _deposit);
        playersRegistered.push(depositeeAddress);
        isRegistered[depositeeAddress] = true;

        //emit LogDeposit(msg.sender, msg.value, msg.sender.balance);
    }

    // First iteration will trust that every player votes correctly:
    // player sends in a listOfWinners array arranged from first to last place
    function voteForWinner(address payable[] memory playerBallot) public payable {
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

        refundDeposit(msg.sender);

        if (votingEnded()) {
            handOutReward();
            // Is this ideal? 
            // The last user to vote has to pay gas for getWinningBallot which is gas costly
            // The memory arrays should free up some gas on selfdestruct to pay the user back.
            selfdestruct(msg.sender);
        }
    }

    function getPlayerCount() public view returns (int) {
        return int(playersRegistered.length);
    }

    function votingEnded() public view returns (bool) {
        return allPlayersHaveVoted() ? true : false;
    }

    function getPercentage(uint number, uint percent) public pure returns (uint) {
        return number.mul(percent).div(100);
    }

    // when majority has voted, then pay the deposit back
    // function majorityHasVoted() public view returns (bool) {
    //     // uint() floors integers, add one to get ceiling.
    //     uint majority = getPercentage(playersRegistered.length, 50).add(1);
    //     return playersVoted.length >= majority;
    // }
    //
    function isEqual(address payable[] memory ballotOne, address payable[] memory ballotTwo) 
    public pure returns (bool) {
        return keccak256(abi.encodePacked(ballotOne)) == keccak256(abi.encodePacked(ballotTwo));
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    // inaccurate breakdown because a lack of decimals in solidity, 
    // prices are not always distributed 100%, needs refactoring
    function getPrizeCalculation(uint place, uint potiumSize, uint pool) public pure returns (uint) {
        uint prizeMath;

        for (uint exp = 0; exp < potiumSize; exp++) {
            prizeMath += 2**exp;
        }
        uint prize = pool.mul(2**(potiumSize.sub(place))).div(prizeMath);

        return prize;
    }

    function getPlayersVotedCount() public view returns (int) {
        return int(playersVoted.length);
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

    // this function takes tons of gas, the last player to vote
    // uses almost 300.000 additional gas.
    function getWinningBallot() private view returns (address payable[] memory) {

        uint64 max = 0;
        address payable[] memory winningBallot;
        address payable[] memory thisBallot;
        address payable[] memory restOfBallots;

        for(uint64 i = 0; i < playersVoted.length; i++ ) {
            uint64 counter = 0;
            thisBallot = ballot[playersVoted[i]];
            for(uint64 j = 1; j < playersVoted.length; j++) {
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

    function handOutReward() private {
        address payable[] memory winningBallot = getWinningBallot();
        require(getPotiumSize() < playersRegistered.length, "TODO");
        for(uint place = getPotiumSize(); place > 0; place--) {
            uint slot = place.sub(1);
            address payable playerAccount = winningBallot[slot];

            require(isRegistered[playerAccount], "Player has to be registered.");
            uint prize = getPrizeCalculation(place, getPotiumSize(), prizePool);

            // The top player gets the "dust" + depositPool if someone didn't vote
            if (place == 1) {
                prize = getContractBalance().add(depositPool);
            }

            emit LogHandout(prize, prizePool);
            prizePool = prizePool.sub(prize);
            playerAccount.transfer(prize);
        }
    }

    function refundDeposit(address payable sender) private {
        depositPool = depositPool.sub(_deposit);
        sender.transfer(_deposit);
        emit LogRefund(_deposit, depositPool, getContractBalance());
    }

    function getPlayerBallot() private view returns (address payable[] memory) {
        return ballot[msg.sender];
    }

    function setBuyInAndDeposit(uint amount) private {
        uint depositAmount = getPercentage(amount, 25);

        _deposit = depositAmount;
        _buyIn = amount - depositAmount;
    }

    function transferDepositBack() private {
        for(uint i = 0; i < playersVoted.length; i++ ) {
            depositPool = depositPool.sub(_deposit);
            playersVoted[i].transfer(_deposit);
        }
    }

    function allPlayersHaveVoted() private view returns (bool) {
        return (playersRegistered.length == playersVoted.length);
    }

}

