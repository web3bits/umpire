// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "./UmpireModel.sol";
import "./UmpireActionInterface.sol";
import "./AbstractUmpireFormulaResolver.sol";

// @todo natspec
contract UmpireRegistry is KeeperCompatibleInterface, Ownable {
    uint public s_counterJobs = 0;
    uint8 public s_minimumMinutesBeforeTimeout = 2;
    uint8 public s_minimumMinutesBetweenActivationAndTimeout = 1;
    uint8 public s_minimumMinutesActivationOffset = 1;
    mapping(uint => address) public s_inputFeeds;
    mapping(uint => UmpireJob) public s_jobs;
    mapping(address => uint[]) public s_jobsByOwner;
    AbstractUmpireFormulaResolver public i_resolver;

    event UmpireJobCreated(uint indexed jobId, address indexed jobOwner, address action);
    event UmpireJobCompleted(uint indexed jobId, address indexed jobOwner, address action, UmpireJobStatus jobStatus);

    constructor (address _resolver) {
        i_resolver = AbstractUmpireFormulaResolver(_resolver);
    }

    function createJobFromNodes(
        string memory _name,
        PostfixNode[] memory _postfixNodesLeft,
        UmpireComparator _comparator,
        PostfixNode[] memory _postfixNodesRight,
        address[] memory _dataFeeds,
        uint _activationDate,
        uint _timeoutDate,
        address _action
    ) external returns (uint jobId) {
        require(_timeoutDate > block.timestamp + (s_minimumMinutesBeforeTimeout * 60), "Timeout date farther into the future required");
        require(_timeoutDate >= _activationDate + (s_minimumMinutesBetweenActivationAndTimeout * 60), "A longer evaluation period required");
        require(Address.isContract(_action), "Action must be a contract");
        if (_activationDate > 0) {
            require(_activationDate >= block.timestamp + (s_minimumMinutesActivationOffset * 60), "Activation must be 0 or in the future");
        }
        jobId = s_counterJobs;
        s_counterJobs = s_counterJobs + 1;

        s_jobs[jobId].id = jobId;
        s_jobs[jobId].jobName = _name;
        s_jobs[jobId].owner = msg.sender;
        s_jobs[jobId].jobStatus = UmpireJobStatus.NEW;
        s_jobs[jobId].comparator = _comparator;
        s_jobs[jobId].createdAt = block.timestamp;
        s_jobs[jobId].activationDate = _activationDate;
        s_jobs[jobId].timeoutDate = _timeoutDate;
        s_jobs[jobId].action = _action;
        s_jobs[jobId].dataFeeds = _dataFeeds;

        for (uint i = 0; i < _postfixNodesLeft.length; i++) {
            s_jobs[jobId].formulaLeft.push(_postfixNodesLeft[i]);
        }

        for (uint i = 0; i < _postfixNodesRight.length; i++) {
            s_jobs[jobId].formulaRight.push(_postfixNodesRight[i]);
        }

        s_jobsByOwner[msg.sender].push(jobId);

        emit UmpireJobCreated(jobId, msg.sender, _action);

        return jobId;
    }

    function evaluateJob(uint _jobId) public view returns (bool, int, int) {
        if (_jobId > s_counterJobs) {
            return (false, 0, 0);
        }

        int[] memory variables = new int[](s_jobs[_jobId].dataFeeds.length);
        for (uint i; i < s_jobs[_jobId].dataFeeds.length; i++) {
            variables[i] = i_resolver.getFeedValue(s_jobs[_jobId].dataFeeds[i]);
        }

        int leftValue;
        int rightValue;
        bool reverted = false;
        try i_resolver.resolve(s_jobs[_jobId].formulaLeft, variables) returns (int _leftValue) {
            leftValue = _leftValue;
        } catch Error(string memory /*_err*/) {
            reverted = true;
        } catch (bytes memory /*_err*/) {
            reverted = true;
        }

        try i_resolver.resolve(s_jobs[_jobId].formulaRight, variables) returns (int _rightValue) {
            rightValue = _rightValue;
        } catch Error(string memory /*_err*/) {
            reverted = true;
        } catch (bytes memory /*_err*/) {
            reverted = true;
        }

        if (reverted) {
            return (false, 0, 0);
        }

        if (s_jobs[_jobId].comparator == UmpireComparator.EQUAL) {
            return (leftValue == rightValue, leftValue, rightValue);
        } else if (s_jobs[_jobId].comparator == UmpireComparator.NOT_EQUAL) {
            return (leftValue != rightValue, leftValue, rightValue);
        } else if (s_jobs[_jobId].comparator == UmpireComparator.GREATER_THAN) {
            return (leftValue > rightValue, leftValue, rightValue);
        } else if (s_jobs[_jobId].comparator == UmpireComparator.GREATER_THAN_EQUAL) {
            return (leftValue >= rightValue, leftValue, rightValue);
        } else if (s_jobs[_jobId].comparator == UmpireComparator.LESS_THAN) {
            return (leftValue < rightValue, leftValue, rightValue);
        } else if (s_jobs[_jobId].comparator == UmpireComparator.LESS_THAN_EQUAL) {
            return (leftValue <= rightValue, leftValue, rightValue);
        } else {
            revert("Unknown comparator");
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
        bytes memory performData
    )
    {
        uint jobsToFinalizeCounter;
        for (uint i; i < s_counterJobs; i++) {
            if (s_jobs[i].jobStatus != UmpireJobStatus.NEW) {
                continue;
            }

            if (block.timestamp > s_jobs[i].timeoutDate) {
                upkeepNeeded = true;
                jobsToFinalizeCounter++;
                continue;
            }

            if (block.timestamp >= s_jobs[i].activationDate) {
                (bool evaluationResult,,) = evaluateJob(i);
                if (evaluationResult == true) {
                    upkeepNeeded = true;
                    jobsToFinalizeCounter++;
                    continue;
                }
            }
        }

        uint[] memory jobIndexes = new uint256[](jobsToFinalizeCounter);
        uint indexCounter;

        for (uint i; i < s_counterJobs; i++) {
            if (s_jobs[i].jobStatus != UmpireJobStatus.NEW) {
                continue;
            }

            if (block.timestamp > s_jobs[i].timeoutDate) {
                jobIndexes[indexCounter] = i;
                indexCounter++;
                continue;
            }

            if (block.timestamp >= s_jobs[i].activationDate) {
                (bool evaluationResult,,) = evaluateJob(i);
                if (evaluationResult == true) {
                    jobIndexes[indexCounter] = i;
                    indexCounter++;
                    continue;
                }
            }
        }

        performData = abi.encode(jobIndexes);

        return (upkeepNeeded, performData);
    }

    /**
     * @notice Performs the work on the contract, if instructed by :checkUpkeep():
     */
    function performUpkeep(
        bytes calldata  performData
    ) external override {
        (uint[] memory jobIndexes) = abi.decode(
            performData,
            (uint[])
        );
        for (uint i; i < jobIndexes.length; i++) {
            require(jobIndexes[i] <= s_counterJobs, "Job index out of bounds");
            require(s_jobs[jobIndexes[i]].jobStatus == UmpireJobStatus.NEW, "Job already finalized");

            if (block.timestamp > s_jobs[jobIndexes[i]].timeoutDate) {
                s_jobs[jobIndexes[i]].jobStatus = UmpireJobStatus.NEGATIVE;
                try UmpireActionInterface(s_jobs[jobIndexes[i]].action).negativeAction() {
                    emit UmpireJobCompleted(i, s_jobs[jobIndexes[i]].owner, s_jobs[jobIndexes[i]].action, UmpireJobStatus.NEGATIVE);
                } catch Error(string memory /*_err*/) {
                    s_jobs[jobIndexes[i]].jobStatus = UmpireJobStatus.REVERTED;
                } catch (bytes memory /*_err*/) {
                    s_jobs[jobIndexes[i]].jobStatus = UmpireJobStatus.REVERTED;
                }
                continue;
            }

            if (block.timestamp >= s_jobs[jobIndexes[i]].activationDate) {
                (
                bool evaluationResult,
                int leftValue,
                int rightValue
                ) = evaluateJob(jobIndexes[i]);
                if (evaluationResult == true) {
                    s_jobs[jobIndexes[i]].jobStatus = UmpireJobStatus.POSITIVE;
                    s_jobs[jobIndexes[i]].leftValue = leftValue;
                    s_jobs[jobIndexes[i]].rightValue = rightValue;
                    try UmpireActionInterface(s_jobs[jobIndexes[i]].action).positiveAction() {
                        emit UmpireJobCompleted(i, s_jobs[jobIndexes[i]].owner, s_jobs[jobIndexes[i]].action, UmpireJobStatus.POSITIVE);
                    } catch Error(string memory /*_err*/) {
                        s_jobs[jobIndexes[i]].jobStatus = UmpireJobStatus.REVERTED;
                    } catch (bytes memory /*_err*/) {
                        s_jobs[jobIndexes[i]].jobStatus = UmpireJobStatus.REVERTED;
                    }
                    continue;
                }
            }
        }
    }

    function updateTimeConstraints(
        uint8 _minimumMinutesBeforeTimeout,
        uint8 _minimumMinutesBetweenActivationAndTimeout,
        uint8 _minimumMinutesActivationOffset
    ) public onlyOwner {
        s_minimumMinutesBeforeTimeout = _minimumMinutesBeforeTimeout;
        s_minimumMinutesBetweenActivationAndTimeout = _minimumMinutesBetweenActivationAndTimeout;
        s_minimumMinutesActivationOffset = _minimumMinutesActivationOffset;
    }

    function getJobsByOwner(address _owner) public view returns (UmpireJob[] memory) {
        uint myJobsCount = s_jobsByOwner[_owner].length;
        if (myJobsCount == 0) {
            revert("You have no jobs");
        }

        UmpireJob[] memory jobs = new UmpireJob[](myJobsCount);

        for (uint i; i < myJobsCount; i++) {
            jobs[i] = s_jobs[s_jobsByOwner[_owner][i]];
        }

        return jobs;
    }

    function getMyJobs() public view returns (UmpireJob[] memory) {
        return getJobsByOwner(msg.sender);
    }
}
