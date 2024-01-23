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

  uint256 public constant MINIMUM_USD = 50 * 1e18;

  address[] public funders;
  mapping(address => uint256) public addressToAmountFunded;

  address public immutable i_owner;

  string private insufficentETHErrorMessage;

  AggregatorV3Interface public priceFeed;

  modifier onlyOwner {
    // require(msg.sender == i_owner, "Sender is not owner");
    if(msg.sender != i_owner) {
        revert  ();
    }
    _;
  }

  constructor(address priceFeedAddress, string memory insufficentETH) {
    i_owner = msg.sender; // whoever deployed this contract
    priceFeed = AggregatorV3Interface(priceFeedAddress);
    insufficentETHErrorMessage = insufficentETH;
    // console.log("testing console.log in solidity", i_owner);
  }

  // receive() external payable {
  //   fund();
  // }

  // fallback() external payable {
  //   fund();
  // }

  function fund() public payable {
      require(msg.value.getEthAmountInUsd(priceFeed) >= MINIMUM_USD, insufficentETHErrorMessage);
      funders.push(msg.sender);
      addressToAmountFunded[msg.sender] = msg.value;
  }

  function withdraw() public onlyOwner {
      for (
        uint256 funderIndex = 0; 
        funderIndex < funders.length; 
        funderIndex++
      ) {
        address funder = funders[funderIndex];
        addressToAmountFunded[funder] = 0;
      }
      // reset the Array
      funders = new address[](0);

      // actually withdraw the funds via transfer or send or call
      (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
      require(callSuccess, "Call failed");
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