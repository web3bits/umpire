// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./UmpireModel.sol";
import "./UmpireRegistry.sol";
import "./UmpireActionInterface.sol";

abstract contract AbstractUmpireAction is Ownable, UmpireActionInterface {
    address public s_umpireRegistry;
    uint public s_umpireJobId;
    bool public s_initialized = false;

    function actionSetup(address _registry, uint _jobId) public onlyOwner {
        s_umpireRegistry = _registry;
        s_umpireJobId = _jobId;
        s_initialized = true;
    }

    modifier isActionAllowed(UmpireJobStatus _status) {
        // Ensure action actually called as a result of a job
        require(s_initialized == true, "Action not yet initialized");
        (
        ,
        ,
        UmpireJobStatus jobStatus,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ) = UmpireRegistry(s_umpireRegistry).s_jobs(s_umpireJobId);
        require(jobStatus == _status, "Not allowed");
        _;
    }

    function positiveAction() external virtual;

    function negativeAction() external virtual;

    function revertedAction() external virtual;
}
