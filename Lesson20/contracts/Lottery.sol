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

	constructor () {
		paymentToken = new LotteryToken("name", "SYM");
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

	function openBets(uint256 closingTime) external whenBetsClosed onlyOwner{
		require (closingTime > block.timestamp, "Closing time must be in the future");
		betsClosingTime = closingTime;
		betsOpen = true;
	}
}