// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./MyERC20.sol";

contract TokenSale {
	uint256 public ratio;
	uint256 public price;
	MyERC20 public paymentToken;
	MyERC721 public nftContract;

	constructor (uint256 _ratio, uint256 _price, address _paymentToken, address _nftContract) {
		ratio = _ratio;
		price = _price;
		paymentToken = MyERC20(_paymentToken);
		nftContract = MyERC721(_nftContract);
	}

	function buyTokens() external payable {
		paymentToken.mint(msg.sender, msg.value * ratio);
	}

	function returnTokens() {
		paymentToken.burnFrom(msg.sender, amount);
		payable(msg.sender).transfer(amount / ratio);
	}

	function mintToken(uint256 nftId) external {
		paymentToken.transferFrom(msg.sender, address(this), price);
		// TODO: mint nft of id nftId
	}
}