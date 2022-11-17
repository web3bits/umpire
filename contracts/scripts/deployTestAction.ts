import hre, { ethers } from 'hardhat';

async function main() {
  const Action = await ethers.getContractFactory('BasicUmpireAction');
  const action = await Action.deploy();
  await action.deployed();

  console.log(`BasicAction deployed to ${action.address}`);

  console.log('Waiting...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    console.log('Verifying action...');
    await hre.run('verify:verify', {
      address: action.address,
      constructorArguments: [],
    });
  } catch (e) {
    console.log(`Could not verify, but that's okay`);
  }

  console.log('DONE!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
