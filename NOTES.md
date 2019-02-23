https://github.com/cgewecke/eth-gas-reporter
https://github.com/protofire/solhint


https://github.com/MeadowSuite/Meadow/wiki/Using-the-VSCode-Solidity-Debugger
https://medium.com/@novablitz/storing-structs-is-costing-you-gas-774da988895e

Test Network Docs Draft:

Test ETH from faucet.
https://faucet.ropsten.be/

Use the public ethereum node from Infura. https://infura.io/
Sign up to get an API_KEY.
Get your 12 words seed from MetaMask:
>Click your profile logo > Settings > Reveal Seed Words. KEEP THIS A SECRET, this is the same seed as for your Main net wallet.
I recommend having a seperate MetaMask account for dev.

Create a file `.env`
```
MNEMONIC="your 12 word seed"
```

`yarn deploy``

Access the deployed contract instance:
`PokerTournament.deployed().then(function(instance){return instance });`

Retrieve the instance by its public address via:
`web3.eth.contract(HelloWorld.abi, contractAddress)`
Where PokerTournament.abi is the locally compile abi, (./build/contracts/PokerTournament.json" and contractAddress is your publicly deployed contract instance.

Invoke it:
`PokerTournament.deployed().then(function(instance){return instance.deposit()});`

https://medium.com/coinmonks/5-minute-guide-to-deploying-smart-contracts-with-truffle-and-ropsten-b3e30d5ee1e