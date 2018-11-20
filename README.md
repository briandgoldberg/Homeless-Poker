# Trustless-Poker
No need for a house!  Manage poker tournament entry fees and winnings on a blockchain without a central entity.

In many countries, it is illegal for a central entity to sponsor or organize gambling.  This project enables groups of any size to gather, play poker, and distribute the winnings without having to trust or pay a middleman.  

MVP
- User chooses amount of Ethereum needed to enter the tournament.
- Users send tokens to the smart contract.  They must send the right amount.
- Users tell the smart contract the game is over and enter the winners  (We are still thinking through the simpliest possible flow / UI for this, please send any ideas)
- Funds are distributed to the winners

Determining Prizes
- 20% (Rounded Up) of users get prizes  = NumPrizes
- Caculate 2^0 + 2^1 + 2^3..... + 2^NumPrizes = PrizeMath
- 2^NumPrizes  /  PrizeMath X Prize Pool = 1st place
- 2^NumPrizes-1  /  PrizeMath X Prize Pool = 2nd place...
