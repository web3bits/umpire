// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../AbstractUmpireAction.sol";
import "../UmpireModel.sol";

enum BasicUmpireActionStatus {
    NEW,
    POSITIVE,
    NEGATIVE,
    REVERTED
}

contract BasicUmpireAction is AbstractUmpireAction {
    BasicUmpireActionStatus public s_status;

    function positiveAction() external override isActionAllowed(UmpireJobStatus.POSITIVE) {
        // Some logic goes here...
        s_status = BasicUmpireActionStatus.POSITIVE;
    }

    function negativeAction() external override isActionAllowed(UmpireJobStatus.NEGATIVE) {
        // Some logic goes here...
        s_status = BasicUmpireActionStatus.NEGATIVE;
    }

    function revertedAction() external override isActionAllowed(UmpireJobStatus.REVERTED) {
        // Some logic goes here...
        s_status = BasicUmpireActionStatus.REVERTED;
    }
}
