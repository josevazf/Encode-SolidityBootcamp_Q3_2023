// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { LotteryToken } from "./LotteryToken.sol";

contract Lottery is Ownable {

	/// @notice Address of the token used as payment for the bets
  LotteryToken public paymentToken;

	/// @notice Flag indicating whether the lottery is open for bets or not
	bool public betsOpen;

	/// @notice Timestamp of the lottery next closing date and time
  uint256 public betsClosingTime;


	/// @notice Constructor function
	/// @param tokenName Name of the token used for payment
	/// @param tokenSymbol Symbol of the token used for payment
	constructor (
		string memory tokenName, 
		string memory tokenSymbol, 
		uint256 _purchaseRatio, 
		uint256 _betPrice, 
		uint256 _betFee
	) {
		paymentToken = new LotteryToken(tokenName, tokenSymbol);
	}

	/// @notice Passes when the lottery is at closed state
	modifier whenBetsClosed() {
		require(!betsOpen, "Lottery is open");
		_;
	}

	/// @notice Passes when the lottery is at open state and the current block timestamp is lower than the lottery closing date
	modifier whenBetsOpen() {
			require(
					betsOpen && block.timestamp < betsClosingTime,
					"Lottery is closed"
			);
			_;
	}

	/// @notice Opens the lottery for receiving bets and sets the closing time
	function openBets(uint256 closingTime) external whenBetsClosed onlyOwner {
		require (closingTime > block.timestamp, "Closing time must be in the future");
		betsClosingTime = closingTime;
		betsOpen = true;
	}





}