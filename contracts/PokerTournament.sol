pragma solidity ^0.4.25;

// https://github.com/MeadowSuite/Meadow/wiki/Using-the-VSCode-Solidity-Debugger

contract PokerTournament {
    uint public buyIn;
    uint public prizePool;
    address[] private playersRegistered;
    address[] private playersVoted;

    mapping(address => uint) private playerBalance;
    mapping(address  => address[]) private ballot;
    
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

    function deposit() public payable {
        emit LogDeposit(msg.sender, msg.value, msg.sender.balance); 
        address depositeeAddress = msg.sender;
        uint depositeeFunds = msg.value;

        require(playerBalance[depositeeAddress] == uint(0), "A player can only deposit once.");

        /* First depositee controls the buy-in amount */
        if (playersRegistered.length == 0) {
            setBuyIn(depositeeFunds);
        }
        else {
            require(depositeeFunds == uint(buyIn), "Deposit amount has to match the buy-in amount.");
        }
        // hold a record over registered players
        playersRegistered.push(depositeeAddress);
        
        // holds a record of balance tied to an address, possibly not needed
        playerBalance[depositeeAddress] += depositeeFunds;

        prizePool += depositeeFunds;
    }

    function getPlayerCount() public view returns (int) {
        return int(playersRegistered.length);
    }

    // First iteration will trust that every player votes correctly:
    // player sends in a listOfWinners array arranged from first to last place
    function voteForWinner(address[] memory listOfWinners) public payable {
        emit LogVoting(prizePool, allPlayersHaveVoted());
        address depositeeAddress = msg.sender;
        require(playerBalance[depositeeAddress] != uint(0), "Voter should be participating.");

        require(ballot[depositeeAddress].length < 1, "A player can only vote once");
        require(
            listOfWinners.length == getPotiumSize(),
            "The amount of addresses in player ballot has to match the potium size."
        );

        // mapping a players ballot (kjörseðill) to his address
        ballot[msg.sender] = listOfWinners; 
    
        // maintain an iterable record for who has voted
        playersVoted.push(msg.sender);

        if (allPlayersHaveVoted()) {
            // TODO: check if all votes match
            // TODO: iterate through the potium in reverse (3-2-1) 
            //  and use playerAccount.transfer(address(this).balance) to transfer the rest/dust.
            //  then selfdestruct();
            for(uint i = 0; i < getPotiumSize(); i++) {
                handOutReward(listOfWinners[i], i);
            }
            
            // TODO: Reset everything, not just the prizepool
            prizePool = 0;
        }
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

        require(playerBalance[playerAccount] != uint(0), "Player has to be registered.");

        uint prize = calculatePrize(place); 

        emit LogHandout2(prize, prizePool);
        require(address(this).balance >= prize, "Contract does not have enough credit");
        
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

    function setBuyIn(uint amount) private {
        require(amount >= 0, "The buy-in amount has to be positive.");
        buyIn = amount;
    }
}

