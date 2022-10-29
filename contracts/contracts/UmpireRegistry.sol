// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "./UmpireModel.sol";
import "./UmpireFormulaResolver.sol";
import "./UmpireActionInterface.sol";
//import "hardhat/console.sol";


// @todo natspec
contract UmpireRegistry is KeeperCompatibleInterface, Ownable {
    uint private s_counterInputs = 0;
    uint private s_counterJobs = 0;
    mapping(uint => address) public s_inputFeeds;
    mapping(uint => UmpireJob) public s_jobs;
    mapping(address => uint[]) public s_jobsByOwner;
    UmpireFormulaResolver public i_resolver;

    constructor (address _resolver) {
        i_resolver = UmpireFormulaResolver(_resolver);
    }

    function createJobFromNodes(
        PostfixNode[] memory _postfixNodesLeft,
        UmpireComparator _comparator,
        PostfixNode[] memory _postfixNodesRight,
        address[] memory _dataFeeds,
        uint _timeout,
        address _action
    ) external returns (uint jobId) {
        require(_timeout > block.timestamp + 5 minutes, "Timeout at least 5 minutes into the future is required");
        jobId = s_counterJobs;
        s_counterJobs = s_counterJobs + 1;

        // @todo consider data feed reuse between jobs?

        s_jobs[jobId].id = jobId;
        s_jobs[jobId].owner = msg.sender;
        s_jobs[jobId].jobStatus = UmpireJobStatus.NEW;
        s_jobs[jobId].comparator = _comparator;
        s_jobs[jobId].createdAt = block.timestamp;
        s_jobs[jobId].timeout = _timeout;
        s_jobs[jobId].action = _action;
        s_jobs[jobId].dataFeeds = _dataFeeds;

        for (uint i = 0; i < _postfixNodesLeft.length; i++) {
            s_jobs[jobId].formulaLeft.push(_postfixNodesLeft[i]);
        }

        for (uint i = 0; i < _postfixNodesRight.length; i++) {
            s_jobs[jobId].formulaRight.push(_postfixNodesRight[i]);
        }

        s_jobsByOwner[msg.sender].push(jobId);

        // @todo emit event

        return jobId;
    }

    function getFeedValue(address _priceFeed) public view returns (int256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(_priceFeed);
        (
        ,
        int256 price,
        ,
        ,
        ) = priceFeed.latestRoundData();
        return price;
    }

    function evaluateJob(uint _jobId) public view returns (bool) {
        if (_jobId > s_counterJobs) {
            return false;
        }

        int[] memory variables = new int[](s_jobs[_jobId].dataFeeds.length);
        for (uint i; i < s_jobs[_jobId].dataFeeds.length; i++) {
            variables[i] = getFeedValue(s_jobs[_jobId].dataFeeds[i]);
        }

        int leftValue = i_resolver.resolve(s_jobs[_jobId].formulaLeft, variables);
        int rightValue = i_resolver.resolve(s_jobs[_jobId].formulaRight, variables);

        if (s_jobs[_jobId].comparator == UmpireComparator.EQUAL) {
            return leftValue == rightValue;
        } else if (s_jobs[_jobId].comparator == UmpireComparator.NOT_EQUAL) {
            return leftValue != rightValue;
        } else if (s_jobs[_jobId].comparator == UmpireComparator.GREATER_THAN) {
            return leftValue > rightValue;
        } else if (s_jobs[_jobId].comparator == UmpireComparator.GREATER_THAN_EQUAL) {
            return leftValue >= rightValue;
        } else if (s_jobs[_jobId].comparator == UmpireComparator.LESS_THAN) {
            return leftValue < rightValue;
        } else if (s_jobs[_jobId].comparator == UmpireComparator.LESS_THAN_EQUAL) {
            return leftValue <= rightValue;
        } else {
            revert("Unknown operator");
        }
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
        // @todo optimization: run performUpkeep with jobIds in checkData, so this should only return jobIds that require upkeep
        // @todo ALSO for each job, if evaluate throws inside try/catch, return true
        for (uint i; i < s_counterJobs; i++) {
            if (s_jobs[i].jobStatus != UmpireJobStatus.NEW) {
                continue;
            }

            if (block.timestamp > s_jobs[i].timeout) {
                upkeepNeeded = true;
                break;
            }

            if (evaluateJob(i)) {
                upkeepNeeded = true;
                break;
            }
        }

        return (upkeepNeeded, "");
    }

    /**
     * @notice Performs the work on the contract, if instructed by :checkUpkeep():
     */
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep(""); // @todo evaluate each processed job again, revert if not needed for some/all
        require(upkeepNeeded, "Upkeep not needed");

        // @todo optimization: run only for each job from performData
        // @todo evaluate job inside try/catch
        // @todo if throws, run reverted action and update job status
        for (uint i; i < s_counterJobs; i++) {
            if (s_jobs[i].jobStatus != UmpireJobStatus.NEW) {
                continue;
            }

            if (block.timestamp > s_jobs[i].timeout) {
                s_jobs[i].jobStatus = UmpireJobStatus.POSITIVE;
                UmpireActionInterface(s_jobs[i].action).positiveAction();
                continue;
            }

            if (evaluateJob(i)) {
                s_jobs[i].jobStatus = UmpireJobStatus.NEGATIVE;
                UmpireActionInterface(s_jobs[i].action).negativeAction();
                break;
            }
        }
    }
}
