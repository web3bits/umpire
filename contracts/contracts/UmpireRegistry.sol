// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "./UmpireModel.sol";
import "./UmpireFormulaResolver.sol";
//import "hardhat/console.sol";


// @todo natspec
contract UmpireRegistry is KeeperCompatibleInterface {
    uint private s_counterInputs = 0;
    uint private s_counterJobs = 0;
    mapping(uint => address) public s_inputFeeds;
    mapping(uint => UmpireJob) public s_jobs;
    mapping(address => uint[]) public s_jobsByOwner;

    function createJobFromNodes(
        PostfixNode[] memory _postfixNodesLeft,
        UmpireComparator _comparator,
        PostfixNode[] memory _postfixNodesRight,
        address[] memory _dataFeeds,
        uint _timeout,
        address action
    ) external returns (uint hackathonId) {
        require(_timeout < block.timestamp + 30 minutes, "Timeout at least 30 minutes into the future is required");
        jobId = s_counterJobs;
        s_counterJobs = s_counterJobs + 1;

        // @todo consider data feed reuse between jobs?

        s_jobs[jobId].id = jobId;
        s_jobs[jobId].owner = msg.sender;
        s_jobs[jobId].jobStatus = UmpireJobStatus.NEW;
        s_jobs[jobId].formulaLeft = _postfixNodesLeft;
        s_jobs[jobId].comparator = _comparator;
        s_jobs[jobId].formulaRight = _postfixNodesRight;
        s_jobs[jobId].createdAt = block.timestamp;
        s_jobs[jobId].timeout = _timeout;
        s_jobs[jobId].action = _action;
        s_jobs[jobId].dataFeeds = _dataFeeds;

        s_jobsByOwner[msg.sender].push(jobId);

        // @todo emit event

        return jobId;
    }

    function getFeedValue(address _priceFeed) public view returns (int256) {
        AggregatorV3Interface memory priceFeed;
        (
        ,
        int256 price,
        ,
        ,
        ) = priceFeed.latestRoundData();
        return price;
    }

    function evaluateJob(uint _jobId) public view returns (boolean) {
        if (_jobId > s_counterJobs) {
            return false;
        }

        // @todo get variables
        // @todo run left and right and comparator
        // @todo we don't need reserved variable IDX for constants - just use deployed contract compatible with v3aggregator that returns a constant
    }

    /**
     * @notice Checks if the contract requires work to be done
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
    public
    view
    override
    returns (
        bool upkeepNeeded,
        bytes memory /* performData */
    )
    {
        // @todo for all NEW jobs, evaluate them, if true -> return true, run performUpkeep with jobIds in checkData
        // @todo ALSO for each job, if timeout passed, run it too
        // @todo ALSO for each job, if evaluate throws inside try/catch, return true
    }

    /**
     * @notice Performs the work on the contract, if instructed by :checkUpkeep():
     */
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep(""); // @todo evaluate each processed job again, revert if not needed for some/all
        require(upkeepNeeded, "Upkeep not needed");

        // @todo for each job from performData, run:
            // @todo evaluate job inside try/catch
            // @todo if positive, run positive action and update job status
            // @todo if negative, run positive action and update job status
            // @todo if throws, run reverted action and update job status
    }
}
