# Homeless-Poker

No need for a house! Manage poker tournament entry fees and winnings on a blockchain without a central entity.

In many countries, it is illegal for a central entity to sponsor or organize gambling. This project enables groups of any size to gather, play poker, and distribute the winnings without having to trust or pay a middleman.

MVP

- User chooses amount of Ethereum needed to enter the tournament.
- Users send tokens to the smart contract. They must send the right amount.
- Users submit 1st, 2nd, 3rd, 4th, etc. winners (based on the number of prizes) by selecting their public key.
- Funds are distributed to the winners

Determining Prizes

- 20% (Rounded Up) of users get prizes = NumPrizes
- Caculate 2^1 + 2^3..... + 2^NumPrizes = PrizeMath
- 2^NumPrizes / PrizeMath X Prize Pool = 1st place
- 2^NumPrizes-1 / PrizeMath X Prize Pool = 2nd place...

Team

- Solidity lead: einaralex
- Javascript Lead: kristjanmik
- Eventually, we would like the project to support more features and blockchains. Contact briandgoldberg@gmail.com with any ideas!

# How to run locally

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

Contract is live on Ropsten test network at
0xa7cec45371adcd537b3aaa6117778ff781a9137d & 0x13c273cb47c7c1fE62865e5b2069C361C574a7F5
https://ropsten.etherscan.io/address/0xa7cec45371adcd537b3aaa6117778ff781a9137d

#Contract functions:

`constructor(username, roomSize, roomSecret)`
Deploying a constract

`register(username, roomCode)`
User registers by depositing to contract, first player controls the amount with `value` in wei.

`vote(ballot)`
`ballot`: array of addresses listed from first to last
User votes for the winnig bracket

`getPotiumSize()`
The amount of players that has to be voted for.

`killswitch()`
Kill the contract when ... tbd

Join page can be opened with query params like so:
`/join?address={address}&code={roomCode}`

Gotchas

Wei is a BigNumber and has to be parse to string to be converted to ETH

Known issues:
`Error: the tx doesn't have the correct nonce. account has nonce of: 0 tx has nonce of: X`
Reset the accounts transaction history.
Go to MetaMask MyAccounts > Settings > Advanced > Reset Account

Hook structure:
https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c
