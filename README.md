# Homeless-Poker
No need for a house!  Manage poker tournament entry fees and winnings on a blockchain without a central entity.

In many countries, it is illegal for a central entity to sponsor or organize gambling.  This project enables groups of any size to gather, play poker, and distribute the winnings without having to trust or pay a middleman.  

MVP
- User chooses amount of Ethereum needed to enter the tournament.
- Users send tokens to the smart contract.  They must send the right amount.
- Users submit 1st, 2nd, 3rd, 4th, etc. winners (based on the number of prizes) by selecting their public key.
- Funds are distributed to the winners

Determining Prizes
- 20% (Rounded Up) of users get prizes  = NumPrizes
- Caculate 2^1 + 2^3..... + 2^NumPrizes = PrizeMath
- 2^NumPrizes  /  PrizeMath X Prize Pool = 1st place
- 2^NumPrizes-1  /  PrizeMath X Prize Pool = 2nd place...

Team
- Solidity lead: einaralex
- Javascript Lead: TBD
- Eventually, we would like the project to support more features and blockchains.  Contact briandgoldberg@gmail.com with any ideas!

# How to run

Install dependencies:
`yarn`

Start the test network
`yarn rpc`

Compile the contract
`yarn compile`

Migrate the contract to the test network (RPC has to be running)
`yarn migrate`

Start the client
`yarn start`

Contract is live on Ropsten test network at 0x5791c4F1c4b3ee91feC5A483bB50bDF7606d319

Public functions:

`deposit()`
Users deposit to contract, first player controls the amount with `value` in wei.

`voteForWinner(ballot)`
`ballot`: array of addresses listed from first to last

`getPotiumSize()`
The amount of players that has to be voted for.

`getPrizeCalculation(place, potiumSize, prizePool)`

`getPlayersVotedCount()`

`getPlayerCount`