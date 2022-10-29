import { ethers } from 'hardhat';

async function main() {
  const UmpireFormulaResolver = await ethers.getContractFactory('UmpireFormulaResolver');
  const resolver = await UmpireFormulaResolver.deploy();
  await resolver.deployed();

  console.log(`UmpireFormulaResolver deployed to ${resolver.address}`);

  const UmpireRegistry = await ethers.getContractFactory('UmpireRegistry');
  const registry = await UmpireRegistry.deploy(resolver.address);
  await registry.deployed();

  console.log(`UmpireRegistry deployed to ${registry.address}`);

  // TODO auto-register for upkeep
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
