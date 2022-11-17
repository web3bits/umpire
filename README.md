# Umpire POC

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
