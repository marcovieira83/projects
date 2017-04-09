pragma solidity ^0.4.2;

contract RevenueSharing {
  string public book = 'MY AWESOME BOOK';

	function RevenueSharing() {
	}

	function newPurchase() payable returns (bool) {
		/*if (msg.value < minimumPrice) throw;*/
		/*if (buyer.balance < msg.value) throw;*/
		var amount = 5 ether;

		/*if (!msg.sender.send(amount)) {
			throw;
		}*/
		return true;
		/*throw;*/
	}
}
