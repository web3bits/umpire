// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface UmpireActionInterface {
    function positiveAction() external;

    function negativeAction() external;

    function revertedAction() external;
}