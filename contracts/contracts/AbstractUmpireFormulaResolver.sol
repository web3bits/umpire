// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./UmpireModel.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

abstract contract AbstractUmpireFormulaResolver {
    function resolve(PostfixNode[] memory _postfixNodes, int[] memory _variables) public pure virtual returns (int);
    function getFeedValue(address _priceFeed) public view virtual returns (int256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(_priceFeed);
        (
        ,
        int256 price,
        ,
        ,
        ) = priceFeed.latestRoundData();
        return price;
    }
}
