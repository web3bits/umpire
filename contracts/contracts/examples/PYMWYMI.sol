// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../AbstractUmpireAction.sol";
import "../UmpireModel.sol";

enum PYMWYMIStatus {
    NEW,
    POSITIVE,
    NEGATIVE
}

/**
 * @title Put Your Money Where Your Mouth Is
 * @notice An example use case for Umpire - an action which allows users to place bets on an outcome of any
 * mathematical formula, using any of the Chainlink data feeds.
 */
contract PYMWYMI is AbstractUmpireAction {
    PYMWYMIStatus public s_status;
    uint public s_betsPositiveTotal;
    uint public s_betsNegativeTotal;
    uint public s_betsTotal;
    uint public s_dust;
    mapping(address => uint) public s_betsPositive;
    mapping(address => uint) public s_betsNegative;

    event PYMWYMIBetResolved(bool outcome);

    function positiveAction() external override isActionAllowed(UmpireJobStatus.POSITIVE) {
        s_status = PYMWYMIStatus.POSITIVE;
        emit PYMWYMIBetResolved(true);
    }

    function negativeAction() external override isActionAllowed(UmpireJobStatus.NEGATIVE) {
        s_status = PYMWYMIStatus.NEGATIVE;
        emit PYMWYMIBetResolved(false);
    }

    function depositFunds(bool _expectedResult) external payable {
        require(msg.value > 0, "You must deposit something when making a bet");

        if (_expectedResult == true) {
            s_betsPositive[msg.sender] += msg.value;
            s_betsPositiveTotal += msg.value;
        } else {
            s_betsNegative[msg.sender] += msg.value;
            s_betsNegativeTotal += msg.value;
        }
        s_betsTotal += msg.value;
    }

    function getWithdrawalLimit(address _address) public view returns (uint) {
        if (s_status == PYMWYMIStatus.NEW || s_betsTotal == 0) {
            return 0;
        }

        if (s_status == PYMWYMIStatus.NEGATIVE) {
            if (s_betsNegativeTotal == 0) {
                return 0;
            }
            uint percentage = 10**6 * s_betsNegative[_address] / s_betsNegativeTotal;
            return percentage * s_betsTotal / 10**6;
        } else {
            if (s_betsPositiveTotal == 0) {
                return 0;
            }
            uint percentage = 10**6 * s_betsPositive[_address] / s_betsPositiveTotal;
            return percentage * s_betsTotal / 10**6;
        }
    }

    function withdrawFunds() public {
        uint withdrawalLimit = getWithdrawalLimit(msg.sender);
        require(withdrawalLimit > 0, "No funds to withdraw");

        if (s_status == PYMWYMIStatus.NEGATIVE) {
            s_dust += s_betsNegative[msg.sender] - withdrawalLimit;
            s_betsNegative[msg.sender] = 0;
        } else {
            s_dust += s_betsPositive[msg.sender] - withdrawalLimit;
            s_betsPositive[msg.sender] = 0;
        }

        (bool success,) = msg.sender.call{value : withdrawalLimit}("");
        require(success, "Transfer failed.");
    }

    function withdrawDust() public onlyOwner {
        require(s_dust > 0, "No dust to collect");
        s_dust = 0;

        (bool success,) = msg.sender.call{value : s_dust}("");
        require(success, "Transfer failed.");
    }
}
