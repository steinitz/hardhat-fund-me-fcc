// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
  /**
   @title: A contract for crowd funding
   @author Steve Steinitz
   @notice demos funding
   @dev implements price feeds as a library
  */

  using PriceConverter for uint256;

  // state variables
  // cheap because constant or immutable
  uint256 public constant MINIMUM_USD = 50 * 1e18;
  address private immutable i_owner;

  // expensive ones
  address[] private s_funders;
  mapping(address => uint256) private s_addressToAmountFunded;

  string private s_insufficentEthErrorMessage;

  AggregatorV3Interface private s_priceFeed;

  modifier onlyOwner {
    // require(msg.sender == i_owner, "Sender is not owner");
    if(msg.sender != i_owner) {
      revert FundMe__NotOwner();
    }
    _;
  }

  constructor(address priceFeedAddress, string memory insufficentETH) {
    i_owner = msg.sender; // whoever deployed this contract
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    s_insufficentEthErrorMessage = insufficentETH;
    // console.log("testing console.log in solidity", i_owner);
  }

  // receive() external payable {
  //   fund();
  // }

  // fallback() external payable {
  //   fund();
  // }

  function fund() public payable {
      require(msg.value.getEthAmountInUsd(s_priceFeed) >= MINIMUM_USD, s_insufficentEthErrorMessage);
      s_funders.push(msg.sender);
      s_addressToAmountFunded[msg.sender] = msg.value;
  }

  // function withdraw() public onlyOwner {
  //     for (
  //       uint256 funderIndex = 0; 
  //       funderIndex < s_funders.length; 
  //       funderIndex++
  //     ) {
  //       address funder = s_funders[funderIndex];
  //       s_addressToAmountFunded[funder] = 0;
  //     }
  //     // reset the Array
  //     s_funders = new address[](0);

  //     // actually withdraw the funds via transfer or send or call
  //     (bool callSuccess, ) = payable(msg.sender)
  //       .call{value: address(this).balance}("");
  //     require(callSuccess, "Call failed");
  // }

  function withdraw() public payable onlyOwner {
    address[] memory funders = s_funders;
    for (
      uint256 funderIndex = 0; 
      funderIndex < funders.length; 
      funderIndex++
    ) {
      address funder = funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;

    }
      // reset the Array
      s_funders = new address[](0);

      // actually withdraw the funds via transfer or send or call
      (bool callSuccess, ) = payable(msg.sender)
        .call{value: address(this).balance}("");
      require(callSuccess, "Call failed");

  }

  function getOwner() public view returns (address) {
    return i_owner;
  }

  function getFunder(uint256 index) public view returns (address) {
    return s_funders[index];
  }

  function getAddressToAmountFunded(address funder) public view returns (uint256) {
    return s_addressToAmountFunded[funder];
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }

  // transfer - automatically reverts
  // payable(msg.sender).transfer(address (this).balance);
  // // send - requires an explicit require test
  // bool sendSuccess = payable(msg.sender).send(address (this).balance);
  // require(sendSuccess, "Send failed");
  // call - recommended way for now
}

/*
contract Lock {
    uint public unlockTime;
    address payable public owner;

    uint256 someVar;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
*/