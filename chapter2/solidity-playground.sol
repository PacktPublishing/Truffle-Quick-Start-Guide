pragma solidity ^0.4.17;


contract SimpleTransfer {
    uint public contractBalance;

    // Define the event
    event LogTransfer(address recipient);

    function SimpleTransfer() public payable {
        contractBalance = msg.value;
    }

    function sendEther(address recipient) public payable returns(bool success) {
        require(contractBalance > msg.value);
        LogTransfer(recipient);
        recipient.transfer(msg.value);
        return success;
    }
}
