import hre, { ethers } from 'hardhat';

async function main() {
  const UmpireFormulaResolver = await ethers.getContractFactory('UmpireFormulaResolverV2');
  const resolver = await UmpireFormulaResolver.deploy();
  await resolver.deployed();

  console.log(`UmpireFormulaResolverV2 deployed to ${resolver.address}`);

  const UmpireRegistry = await ethers.getContractFactory('UmpireRegistry');
  const registry = await UmpireRegistry.deploy(resolver.address);
  await registry.deployed();

  console.log(`UmpireRegistry deployed to ${registry.address}`);

  console.log('Waiting...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    console.log('Verifying resolver...');
    await hre.run('verify:verify', {
      address: resolver.address,
      constructorArguments: [],
    });
  } catch(e) {
    console.log(`Could not verify, but that's okay`);
  }

  console.log('Waiting...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    console.log('Verifying registry...');

    await hre.run('verify:verify', {
      address: registry.address,
      constructorArguments: [resolver.address],
    });
  } catch(e) {
    console.log(`Could not verify, but that's okay`);
  }

  console.log('DONE!');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
