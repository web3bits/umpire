// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract UmpireConstantE is AggregatorV3Interface {
    int256 i_value = 271828;
    function decimals() external pure returns (uint8) {
        return 5;
    }

    function description() external pure returns (string memory) {
        return "Pi";
    }

    function version() external pure returns (uint256) {
        return 1;
    }

    function getRoundData(uint80 _roundId)
    external
    view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (_roundId, i_value, block.timestamp, block.timestamp, _roundId);
    }

    function latestRoundData()
    external
    view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (1, i_value, block.timestamp, block.timestamp, 1);
    }
}
