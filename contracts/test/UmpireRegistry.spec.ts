import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { pfOperator, pfValue } from './utils';
import {UmpireComparator, UmpireJobStatus} from "../enums";

describe('UmpireRegistry', function () {
  async function deployContracts() {
    const [owner, otherAccount] = await ethers.getSigners();

    const FormulaResolver = await ethers.getContractFactory('UmpireFormulaResolver');
    const Registry = await ethers.getContractFactory('UmpireRegistry');
    const BasicAction = await ethers.getContractFactory('BasicUmpireAction');

    const action = await BasicAction.deploy();
    const resolver = await FormulaResolver.deploy();
    const registry = await Registry.deploy(resolver.address);

    return {
      action,
      resolver,
      registry,
      owner,
      otherAccount,
    };
  }

  it('2 + 2 = 4', async () => {
    const { action, registry, owner, otherAccount } = await loadFixture(deployContracts);

    // Initial conditions
    let upkeepNeeded = await registry.checkUpkeep([]);
    let actionStatus = await action.s_status();
    expect(actionStatus).to.equal(0);
    expect(upkeepNeeded.upkeepNeeded).to.equal(false);
    expect(await registry.s_counterJobs()).to.equal(0);

    // Create job
    const timeoutDate = Math.round((+new Date())/1000) + 365*24*60*60;
    const jobCreationTx = await registry.createJobFromNodes(
      'job name',
      [pfValue(2), pfValue(2), pfOperator('+')],
      0,
      [pfValue(4)],
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
    await expect(
      action.positiveAction()
    ).to.be.revertedWith("Not allowed");
    await expect(
      action.negativeAction()
    ).to.be.revertedWith("Not allowed");
    await expect(
      action.revertedAction()
    ).to.be.revertedWith("Not allowed");

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
    expect(job.leftValue).to.equal(4);
    expect(job.rightValue).to.equal(4);
    expect(job.jobName).to.equal('job name');
    await expect(
      action.negativeAction()
    ).to.be.revertedWith("Not allowed");
    await expect(
      action.revertedAction()
    ).to.be.revertedWith("Not allowed");
  });
});
