# Umpire

https://umpire.vercel.app/

### TL;DR
Umpire is a low-code tool for quickly setting up backends for hybrid dApps. To see how it works, take a look at the tests:    
https://github.com/web3bits/umpire/blob/main/contracts/test/PYMWYMI.spec.ts    
https://github.com/web3bits/umpire/blob/main/contracts/test/UmpireRegistryUsingV2.spec.ts    

This project has been created for Chainlink 2022 Fall Hackathon. We hope you like it, all criticism, feedback or contributions are welcome.

Please note, this is a proof of concept and should be treated as such, code is provided as is, do not use in production with real funds!

![Architecture](/architecture.png)

## Deploying Umpire contracts

```shell
cd contracts
npx hardhat run scripts/deploy.ts --network mumbai # deploys ResolverV2 and Registry to Polygon Mumbai testnet
npx hardhat run scripts/deployTestAction.ts --network mumbai # deploys a test action, convenient for testing
```

There are relatively extensive tests in the `contracts/test` directory, but they should not be run in parallel - run one by one.

## Last deployment @ Mumbai:

```
UmpireFormulaResolverV2 deployed to 0x2921e494DD0Ccc5AEdaF6e57640028Dc12165e8e
UmpireRegistry deployed to 0x8B0Eb23290b4C7d159AFd4854Ca676e70740dECe
Upkeep: https://automation.chain.link/mumbai/42817439792740538657215435735332854623359948778852290302201139228819821179935 
```

## Running frontend

```shell
cd frontend
cp .env.example .env
nano .env # set your env variables
yarn install
yarn dev
```
