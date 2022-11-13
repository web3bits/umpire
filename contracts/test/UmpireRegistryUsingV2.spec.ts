import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { numToSD59x18, pfOperator, pfValueSD59x18, pfVariable } from './utils';
import { UmpireComparator, UmpireJobStatus } from '../enums';

const timeOffset = 365 * 24 * 60 * 60;

const PI = numToSD59x18(3.14159265359);
const E = numToSD59x18(2.71828);

describe('UmpireRegistry with V2 resolver', function () {
  async function deployContracts() {
    const [owner, otherAccount] = await ethers.getSigners();

    const FormulaResolver = await ethers.getContractFactory('UmpireFormulaResolverV2');
    const Registry = await ethers.getContractFactory('UmpireRegistry');
    const BasicAction = await ethers.getContractFactory('BasicUmpireAction');
    const BrokenAction = await ethers.getContractFactory('BrokenUmpireAction');

    const action = await BasicAction.deploy();
    const brokenAction = await BrokenAction.deploy();
    const resolver = await FormulaResolver.deploy();
    const registry = await Registry.deploy(resolver.address);

    const UmpireConstantPi = await ethers.getContractFactory('UmpireConstantPi');
    const UmpireConstantE = await ethers.getContractFactory('UmpireConstantE');

    const pi = await UmpireConstantPi.deploy();
    const e = await UmpireConstantE.deploy();

    return {
      action,
      brokenAction,
      resolver,
      registry,
      owner,
      otherAccount,
      pi,
      e,
    };
  }

  it('2 + 2 = 4', async () => {
    const { action, registry, owner } = await loadFixture(deployContracts);

    // Initial conditions
    let upkeepNeeded = await registry.checkUpkeep([]);
    let actionStatus = await action.s_status();
    expect(actionStatus).to.equal(0);
    expect(upkeepNeeded.upkeepNeeded).to.equal(false);
    expect(await registry.s_counterJobs()).to.equal(0);

    // Create job
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

    // Job status should still not change
    actionStatus = await action.s_status();
    expect(actionStatus).to.equal(0);
    expect(await registry.s_counterJobs()).to.equal(1);
    upkeepNeeded = await registry.checkUpkeep([]);
    expect(upkeepNeeded.upkeepNeeded).to.equal(true);
    let job = await registry.s_jobs(0);
    expect(job.id).to.equal(0);
    expect(job.owner).to.equal(owner.address);
    expect(job.jobStatus).to.equal(UmpireJobStatus.NEW);
    expect(job.comparator).to.equal(UmpireComparator.EQUAL);
    expect(job.timeoutDate).to.equal(timeoutDate);
    expect(job.activationDate).to.equal(0);
    expect(job.action).to.equal(action.address);
    expect(job.leftValue).to.equal(0);
    expect(job.rightValue).to.equal(0);
    expect(job.jobName).to.equal('job name');
    await expect(action.positiveAction()).to.be.revertedWith('Not allowed');
    await expect(action.negativeAction()).to.be.revertedWith('Not allowed');

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    actionStatus = await action.s_status();
    expect(actionStatus).to.equal(1);
    expect(await registry.s_counterJobs()).to.equal(1);
    upkeepNeeded = await registry.checkUpkeep([]);
    expect(upkeepNeeded.upkeepNeeded).to.equal(false);
    job = await registry.s_jobs(0);
    expect(job.id).to.equal(0);
    expect(job.owner).to.equal(owner.address);
    expect(job.jobStatus).to.equal(UmpireJobStatus.POSITIVE);
    expect(job.comparator).to.equal(UmpireComparator.EQUAL);
    expect(job.timeoutDate).to.equal(timeoutDate);
    expect(job.activationDate).to.equal(0);
    expect(job.action).to.equal(action.address);
    expect(job.leftValue).to.equal(numToSD59x18(4));
    expect(job.rightValue).to.equal(numToSD59x18(4));
    expect(job.jobName).to.equal('job name');
    await expect(action.negativeAction()).to.be.revertedWith('Not allowed');
  });

  it('Pi > e', async () => {
    const { action, registry, pi, e } = await loadFixture(deployContracts);

    // Create job
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'pi > e',
      [pfVariable(0)],
      UmpireComparator.GREATER_THAN,
      [pfVariable(1)],
      [pi.address, e.address],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const actionStatus = await action.s_status();
    expect(actionStatus).to.equal(1);
    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.POSITIVE);
    expect(job.leftValue).to.equal(PI);
    expect(job.rightValue).to.equal(E);
  });

  it('Pi >= e', async () => {
    const { action, registry, pi, e } = await loadFixture(deployContracts);

    // Create job
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'pi >= e',
      [pfVariable(0)],
      UmpireComparator.GREATER_THAN_EQUAL,
      [pfVariable(1)],
      [pi.address, e.address],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const actionStatus = await action.s_status();
    expect(actionStatus).to.equal(1);
    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.POSITIVE);
    expect(job.leftValue).to.equal(PI);
    expect(job.rightValue).to.equal(E);
  });

  it('Pi < e', async () => {
    const { action, registry, pi, e } = await loadFixture(deployContracts);

    // Create job
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'pi < e',
      [pfVariable(0)],
      UmpireComparator.LESS_THAN,
      [pfVariable(1)],
      [pi.address, e.address],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    const upkeepNeeded = await registry.checkUpkeep([]);
    expect(upkeepNeeded.upkeepNeeded).to.equal(false);

    await network.provider.send('evm_increaseTime', [timeOffset + 1]);
    await network.provider.send('evm_mine');

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const actionStatus = await action.s_status();
    expect(actionStatus).to.equal(2);
    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.NEGATIVE);
  });

  it('Pi <= e', async () => {
    const { action, registry, pi, e } = await loadFixture(deployContracts);

    // Create job
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'pi <= e',
      [pfVariable(0)],
      UmpireComparator.LESS_THAN_EQUAL,
      [pfVariable(1)],
      [pi.address, e.address],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    const upkeepNeeded = await registry.checkUpkeep([]);
    expect(upkeepNeeded.upkeepNeeded).to.equal(false);

    await network.provider.send('evm_increaseTime', [timeOffset + 1]);
    await network.provider.send('evm_mine');

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const actionStatus = await action.s_status();
    expect(actionStatus).to.equal(2);
    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.NEGATIVE);
  });

  it('Pi = e', async () => {
    const { action, registry, pi, e } = await loadFixture(deployContracts);

    // Create job
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'pi = e',
      [pfVariable(0)],
      UmpireComparator.EQUAL,
      [pfVariable(1)],
      [pi.address, e.address],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    const upkeepNeeded = await registry.checkUpkeep([]);
    expect(upkeepNeeded.upkeepNeeded).to.equal(false);

    await network.provider.send('evm_increaseTime', [timeOffset + 1]);
    await network.provider.send('evm_mine');

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const actionStatus = await action.s_status();
    expect(actionStatus).to.equal(2);
    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.NEGATIVE);
  });

  it('Pi != e', async () => {
    const { action, registry, pi, e } = await loadFixture(deployContracts);

    // Create job
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'pi != e',
      [pfVariable(0)],
      UmpireComparator.NOT_EQUAL,
      [pfVariable(1)],
      [pi.address, e.address],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const actionStatus = await action.s_status();
    expect(actionStatus).to.equal(1);
    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.POSITIVE);
    expect(job.leftValue).to.equal(PI);
    expect(job.rightValue).to.equal(E);
  });

  it('Pi - 0.42331 = e', async () => {
    const { action, registry, pi, e } = await loadFixture(deployContracts);

    // Create job
    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'Pi - 0.42331265359 = e',
      [pfVariable(0), pfValueSD59x18(0.42331265359), pfOperator('-')],
      UmpireComparator.EQUAL,
      [pfVariable(1)],
      [pi.address, e.address],
      0,
      timeoutDate,
      action.address
    );
    await jobCreationTx.wait();
    await (await action.actionSetup(registry.address, 0)).wait();

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const actionStatus = await action.s_status();
    expect(actionStatus).to.equal(1);
    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.POSITIVE);
    expect(job.leftValue).to.equal(E);
    expect(job.rightValue).to.equal(E);
  });

  it('broken action - positive', async () => {
    const { brokenAction, registry } = await loadFixture(deployContracts);

    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'job name',
      [pfValueSD59x18(2)],
      UmpireComparator.EQUAL,
      [pfValueSD59x18(2)],
      [],
      0,
      timeoutDate,
      brokenAction.address
    );
    await jobCreationTx.wait();
    await (await brokenAction.actionSetup(registry.address, 0)).wait();

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.REVERTED);
  });

  it('broken action - negative', async () => {
    const { brokenAction, registry } = await loadFixture(deployContracts);

    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'job name',
      [pfValueSD59x18(2)],
      UmpireComparator.NOT_EQUAL,
      [pfValueSD59x18(2)],
      [],
      0,
      timeoutDate,
      brokenAction.address
    );
    await jobCreationTx.wait();
    await (await brokenAction.actionSetup(registry.address, 0)).wait();

    await network.provider.send('evm_increaseTime', [timeOffset + 1]);
    await network.provider.send('evm_mine');

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.REVERTED);

    const myJobs = await registry.getMyJobs();
    expect(myJobs[0].jobStatus).to.equal(UmpireJobStatus.REVERTED);
  });

  it('bad action address - not contract', async () => {
    const { registry } = await loadFixture(deployContracts);

    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;

    await expect(registry.createJobFromNodes(
      'job name',
      [pfValueSD59x18(2)],
      UmpireComparator.EQUAL,
      [pfValueSD59x18(2)],
      [],
      0,
      timeoutDate,
      '0x0000000000000000000000000000000000000000'
    )).to.be.revertedWith('Action must be a contract');
  });

  it('bad action address - not action interface', async () => {
    const { registry } = await loadFixture(deployContracts);

    const timeoutDate = Math.round(+new Date() / 1000) + timeOffset;
    const jobCreationTx = await registry.createJobFromNodes(
      'job name',
      [pfValueSD59x18(2)],
      UmpireComparator.EQUAL,
      [pfValueSD59x18(2)],
      [],
      0,
      timeoutDate,
      registry.address
    );
    await jobCreationTx.wait();

    // Run upkeep - should trigger an action
    const runUpkeepTx = await registry.performUpkeep([]);
    await runUpkeepTx.wait();

    const job = await registry.s_jobs(0);
    expect(job.jobStatus).to.equal(UmpireJobStatus.REVERTED);
  });
});
