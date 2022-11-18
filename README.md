# Umpire

https://umpire.vercel.app/

### TL;DR
Umpire is a low-code tool for quickly setting up backends for hybrid dApps. To see how it works, take a look at the tests:
https://github.com/web3bits/umpire/blob/main/contracts/test/PYMWYMI.spec.ts
https://github.com/web3bits/umpire/blob/main/contracts/test/UmpireRegistryUsingV2.spec.ts

This project has been created for Chainlink 2022 Fall Hackathon. We hope you like it, all criticism, feedback or contributions are welcome.

Please note, this is a proof of concept and should be treated as such, code is provided as is, do not use in production with real funds!

## Umpire contracts

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat run scripts/deploy.ts # deploys locally
npx hardhat run scripts/deploy.ts --network mumbai # deploys to Polygon Mumbai testnet
```

## Last deployment @ Mumbai:

```
UmpireFormulaResolverV2 deployed to 0xF438eb88Aa5A5E494f6196710dDe9858E5ca1672
UmpireRegistry deployed to 0xE2EB9874468E26DB1B114eF7ba85567D17436d61
Upkeep: https://automation.chain.link/mumbai/0x97868eaec31eb78439245ddc483c1f1a47e18a8a25cedb573757c3f56f6890cc 
```

## Running frontend

```shell
cd frontend
cp .env.example .env
nano .env # set your env variables
yarn install
yarn dev
```
