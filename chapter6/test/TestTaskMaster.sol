pragma solidity ^0.4.17;


import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TaskMaster.sol";


contract TestTaskMaster {
    function testInitialBalance() {
        TaskMaster taskMaster = TaskMaster(DeployedAddresses.TaskMaster());
        uint expectedBalance = 10000;
        uint actualBalance = taskMaster.getBalance(taskMaster.owner());
        Assert.equal(actualBalance, expectedBalance, 'Owner should have 10000 wei');
    }
    function testReward() {
        TaskMaster taskMaster = new TaskMaster();

        address recipientAddress = 0xE0f5206BBD039e7b0592d8918820024e2a7437b9;
        uint rewardAmount = 50;
        taskMaster.reward(recipientAddress, rewardAmount);

        uint expectedRecipientBalance = 50;
        uint actualRecipientBalance = taskMaster.getBalance(recipientAddress);
        Assert.equal(actualRecipientBalance, expectedRecipientBalance, "Recipient should have 50 wei");

        uint expectedOwnerBalance = 9950;
        uint actualOwnerBalance = taskMaster.getBalance(taskMaster.owner());
        Assert.equal(actualOwnerBalance, expectedOwnerBalance, "Owner should have 9950 wei");
    }
}
