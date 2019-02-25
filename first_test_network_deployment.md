$ truffle deploy --network ropsten
Compiling ./contracts/PokerTournament.sol...
Writing artifacts to ./build/contracts

⚠️  Important ⚠️
If you're using an HDWalletProvider, it must be Web3 1.0 enabled or your migration will hang.


Migrations dry-run (simulation)
===============================
> Network name:    'ropsten-fork'
> Network id:      3
> Block gas limit: 8000000


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > account:             0xB64Fed2aFF534D5320BF401d0D5B93Ed7AbCf13E
   > balance:             0.999483676
   > gas used:            258162
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.000516324 ETH

   -------------------------------------
   > Total cost:         0.000516324 ETH


2_deploy_contract.js
====================

   Deploying 'PokerTournament'
   ---------------------------
   > account:             0xB64Fed2aFF534D5320BF401d0D5B93Ed7AbCf13E
   > balance:             0.996191616
   > gas used:            1619002
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.003238004 ETH

   -------------------------------------
   > Total cost:         0.003238004 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.003754328 ETH

⚠️  Important ⚠️
If you're using an HDWalletProvider, it must be Web3 1.0 enabled or your migration will hang.


Starting migrations...
======================
> Network name:    'ropsten'
> Network id:      3
> Block gas limit: 8000029


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x332b3512dfaf665ef55099ecc31accb20269e8308bcd25dfbc4b29e5ce3aeca1
   > Blocks: 1            Seconds: 16
   > contract address:    0x5791c4F1c4b3ee91feC5A483bB50bDF7606d3197
   > account:             0xB64Fed2aFF534D5320BF401d0D5B93Ed7AbCf13E
   > balance:             0.99453676
   > gas used:            273162
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00546324 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00546324 ETH


2_deploy_contract.js
====================

   Deploying 'PokerTournament'
   ---------------------------
   > transaction hash:    0x332dc53823855900a8510bd0b096e9167979dee72d41a1342bdba5171311872a
   > Blocks: 0            Seconds: 20
   > contract address:    0xA7CEC45371adCd537B3AaA6117778fF781A9137d
   > account:             0xB64Fed2aFF534D5320BF401d0D5B93Ed7AbCf13E
   > balance:             0.96131616
   > gas used:            1619002
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03238004 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.03238004 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.03784328 ETH

✨  Done in 86.94s.