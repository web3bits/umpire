// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../UmpireActionInterface.sol";

enum BasicUmpireActionStatus {
    NEW,
    POSITIVE,
    NEGATIVE,
    REVERTED
}

contract BasicUmpireAction is UmpireActionInterface {
    BasicUmpireActionStatus public s_status;

    function positiveAction() external {
        s_status = BasicUmpireActionStatus.POSITIVE;
    }

    function negativeAction() external {
        s_status = BasicUmpireActionStatus.NEGATIVE;
    }

    function revertedAction() external {
        s_status = BasicUmpireActionStatus.REVERTED;
    }
}
