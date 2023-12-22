// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
   function aggregatorV3Interface() internal pure returns(AggregatorV3Interface) {
        AggregatorV3Interface result = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        return result;
    } 

    function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256) {
        // we get the price-feed address, 0x694A..., from the chainlink docs
        // AggregatorV3Interface priceFeed = aggregatorV3Interface();
        (, int256 price ,,,) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = aggregatorV3Interface();
        return priceFeed.version();
    }

    function getEthAmountInUsd(
      uint256 ethAmount, 
      AggregatorV3Interface priceFeed
      ) public view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}