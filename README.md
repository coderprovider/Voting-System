# Voting App exection Guide

Thank you for using my Voting application. <br />
This application consists of three parts: Smart contract, unit test and front-end.

## Getting Started

1. Run Hardhat Network: You can run a local Hardhat Network instance by running:

```bash
npx hardhat node
```

This will spin up a local Ethereum network. You will see output similar to:

```bash

Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts:
0x123... (1000 ETH)
0x456... (1000 ETH)
...

```

2. Keep the Local Node Running: Leave this terminal open with the node running. This network mimics a real Ethereum environment, but it’s only local, so transactions are fast and don't require real ETH.

3. Compile the smart contract

```bash
npx hardhat compile
```

4. Deploy to the localtest net

```bash
npx hardhat run scripts/deploy.js --network localhost
```

5. Run the test on the local testnet

```bash
npx hardhat test --network localhost
```

6. Run the front-end

Leave this terminal open with the node running.
Open other terminal.

```bash
npm start
```

## Reference
MetaMask must be installed to ensure interaction between the frontend and voting contract deployed on the local testnet. <br />
The process of a contract can be simulated through the front-end.
