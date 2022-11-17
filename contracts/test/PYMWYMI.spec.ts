import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { pfOperator, pfValueSD59x18 } from './utils';
import { UmpireComparator } from '../enums';

const timeOffset = 365 * 24 * 60 * 60;

describe('PYMWYMI', function () {
  async function deployContracts() {
    const [owner, other1, other2, other3, other4, other5] = await ethers.getSigners();

    const PYMWYMI = await ethers.getContractFactory('PYMWYMI');
    const FormulaResolver = await ethers.getContractFactory('UmpireFormulaResolverV2');
    const Registry = await ethers.getContractFactory('UmpireRegistry');
    const action = await PYMWYMI.deploy();
    const resolver = await FormulaResolver.deploy();
    const registry = await Registry.deploy(resolver.address);

    return {
      action,
      resolver,
      registry,
      owner,
      other1,
      other2,
      other3,
      other4,
      other5,
    };
  }

  it('no bets placed', async () => {
    const { action, owner, other1, other2, registry } = await loadFixture(deployContracts);
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'job name',
      [pfValueSD59x18(2), pfValueSD59x18(2), pfOperator('+')],
      UmpireComparator.EQUAL,
      [pfValueSD59x18(4)],
      [],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();
    const upkeepNeeded = await registry.checkUpkeep([]);
    expect(upkeepNeeded.upkeepNeeded).to.equal(true);
    const runUpkeepTx = await registry.performUpkeep(upkeepNeeded.performData);
    await runUpkeepTx.wait();

    const actionStatus = await action.s_status();
    const betsPositiveTotal = await action.s_betsPositiveTotal();
    const betsNegativeTotal = await action.s_betsNegativeTotal();
    const betsTotal = await action.s_betsTotal();
    const withdrawalLimitOwner = await action.getWithdrawalLimit(owner.address);
    const withdrawalLimitOther = await action.getWithdrawalLimit(other1.address);

    expect(actionStatus).to.equal(1);
    expect(betsPositiveTotal).to.equal(0);
    expect(betsNegativeTotal).to.equal(0);
    expect(betsTotal).to.equal(0);
    expect(withdrawalLimitOwner).to.equal(0);
    expect(withdrawalLimitOther).to.equal(0);
  });

  it('positive outcome, only negative bets', async () => {
    const { action, owner, other1, other2, registry } = await loadFixture(deployContracts);
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'job name',
      [pfValueSD59x18(2), pfValueSD59x18(2), pfOperator('+')],
      UmpireComparator.EQUAL,
      [pfValueSD59x18(4)],
      [],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    await action.connect(owner).depositFunds(false, { value: ethers.utils.parseEther('0.01') });
    await action.connect(other1).depositFunds(false, { value: ethers.utils.parseEther('0.03') });
    await action.connect(other2).depositFunds(false, { value: ethers.utils.parseEther('0.07') });

    const upkeepNeeded = await registry.checkUpkeep([]);
    expect(upkeepNeeded.upkeepNeeded).to.equal(true);
    const runUpkeepTx = await registry.performUpkeep(upkeepNeeded.performData);
    await runUpkeepTx.wait();

    let withdrawalLimit = await action.getWithdrawalLimit(owner.address);
    expect(withdrawalLimit).to.equal(0);
    withdrawalLimit = await action.getWithdrawalLimit(other1.address);
    expect(withdrawalLimit).to.equal(0);
    withdrawalLimit = await action.getWithdrawalLimit(other2.address);
    expect(withdrawalLimit).to.equal(0);

    const actionStatus = await action.s_status();
    const betsPositiveTotal = await action.s_betsPositiveTotal();
    const betsNegativeTotal = await action.s_betsNegativeTotal();
    const betsTotal = await action.s_betsTotal();
    expect(actionStatus).to.equal(1);
    expect(betsPositiveTotal).to.equal(0);
    expect(betsNegativeTotal).to.equal(ethers.utils.parseEther('0.11'));
    expect(betsTotal).to.equal(ethers.utils.parseEther('0.11'));
  });

  it('positive outcome, only positive bets', async () => {
    const { action, owner, other1, other2, registry } = await loadFixture(deployContracts);
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'job name',
      [pfValueSD59x18(2), pfValueSD59x18(2), pfOperator('+')],
      UmpireComparator.EQUAL,
      [pfValueSD59x18(4)],
      [],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    await action.connect(owner).depositFunds(true, { value: ethers.utils.parseEther('0.01') });
    await action.connect(other1).depositFunds(true, { value: ethers.utils.parseEther('0.03') });
    await action.connect(other2).depositFunds(true, { value: ethers.utils.parseEther('0.07') });

    const upkeepNeeded = await registry.checkUpkeep([]);
    expect(upkeepNeeded.upkeepNeeded).to.equal(true);
    const runUpkeepTx = await registry.performUpkeep(upkeepNeeded.performData);
    await runUpkeepTx.wait();

    let withdrawalLimit = await action.getWithdrawalLimit(owner.address);
    expect(withdrawalLimit).to.equal(ethers.utils.parseEther('0.00999999'));
    withdrawalLimit = await action.getWithdrawalLimit(other1.address);
    expect(withdrawalLimit).to.equal(ethers.utils.parseEther('0.02999997'));
    withdrawalLimit = await action.getWithdrawalLimit(other2.address);
    expect(withdrawalLimit).to.equal(ethers.utils.parseEther('0.06999993'));

    const actionStatus = await action.s_status();
    const betsPositiveTotal = await action.s_betsPositiveTotal();
    const betsNegativeTotal = await action.s_betsNegativeTotal();
    const betsTotal = await action.s_betsTotal();
    expect(actionStatus).to.equal(1);
    expect(betsPositiveTotal).to.equal(ethers.utils.parseEther('0.11'));
    expect(betsNegativeTotal).to.equal(0);
    expect(betsTotal).to.equal(ethers.utils.parseEther('0.11'));

    let withdraw = await action.connect(owner).withdrawFunds();
    await withdraw.wait();
    let dust = await action.s_dust();
    expect(dust).to.equal(ethers.utils.parseEther('0.00000001'));
  });

  it('positive outcome, mixed bets', async () => {
    const { action, owner, other1, other2, registry } = await loadFixture(deployContracts);
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'job name',
      [pfValueSD59x18(2), pfValueSD59x18(2), pfOperator('+')],
      UmpireComparator.EQUAL,
      [pfValueSD59x18(4)],
      [],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    await action.connect(owner).depositFunds(true, { value: ethers.utils.parseEther('0.01') });
    await action.connect(other1).depositFunds(false, { value: ethers.utils.parseEther('0.02') });
    await action.connect(other2).depositFunds(true, { value: ethers.utils.parseEther('0.03') });
    await action.connect(other2).depositFunds(false, { value: ethers.utils.parseEther('0.03') });

    const upkeepNeeded = await registry.checkUpkeep([]);
    expect(upkeepNeeded.upkeepNeeded).to.equal(true);
    const runUpkeepTx = await registry.performUpkeep(upkeepNeeded.performData);
    await runUpkeepTx.wait();

    let withdrawalLimit = await action.getWithdrawalLimit(owner.address);
    expect(withdrawalLimit).to.equal(ethers.utils.parseEther('0.0225'));
    withdrawalLimit = await action.getWithdrawalLimit(other1.address);
    expect(withdrawalLimit).to.equal(0);
    withdrawalLimit = await action.getWithdrawalLimit(other2.address);
    expect(withdrawalLimit).to.equal(ethers.utils.parseEther('0.0675'));
  });
});
