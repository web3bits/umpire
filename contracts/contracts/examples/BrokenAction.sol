// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../AbstractUmpireAction.sol";
import "../UmpireModel.sol";

contract BrokenUmpireAction is AbstractUmpireAction {
    function positiveAction() external override isActionAllowed(UmpireJobStatus.POSITIVE) {
        revert("Oopsie-daisy");
    }

    function negativeAction() external override isActionAllowed(UmpireJobStatus.NEGATIVE) {
        revert("Oopsie-daisy");
    }
}
