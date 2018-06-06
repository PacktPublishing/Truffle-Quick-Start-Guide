const TaskMaster = artifacts.require('../contracts/TaskMaster.sol');
const expectedExceptionPromise = require('../util/expected-exception-promise.js');

contract('TaskMaster', accounts => {

  let owner, recipient;

  before('should set owner', () => {
      assert.isAtLeast(accounts.length, 2, 'There should be at least 2 accounts');
      owner = accounts[0];
      recipient = accounts[1];
  });

  it('should set owner balance', function() {
    const expectedOwnerBalance = 10000;
    let instance;

    return TaskMaster.deployed()
      .then(_instance => {
          instance = _instance;
          return instance.getBalance(owner, { from: owner });
      })
      .then(actualOwnerBalance => {
          assert.equal(actualOwnerBalance, expectedOwnerBalance, `Owner should have ${expectedOwnerBalance}`);
          return;
      });
  });

  it('should be able to reward recipient', function() {
    const REWARD_WEI = 50;
    const expectedOwnerBalance = 9950;
    const expectedRecipientBalance = 50;
    let instance;

    return TaskMaster.deployed()
      .then(_instance => {
        instance = _instance;
        return instance.reward(recipient, REWARD_WEI, {
          from: owner
        });
      })
      .then(rewardTxObj => {
          const LOG_RECIPIENT_REWARD = 'LogRecipientRewarded';
          const recipientRewardedLog = rewardTxObj.logs[0];
          assert.strictEqual(
            recipientRewardedLog.event,
            LOG_RECIPIENT_REWARD,
            `${LOG_RECIPIENT_REWARD} was not not thrown!`
          );

          const recipientFromLog = recipientRewardedLog.args.recipient;
          const rewardAmountFromLog = recipientRewardedLog.args.rewardAmount.toNumber();
          assert.strictEqual(
            recipientFromLog,
            recipient,
            `Recipient should be ${recipient}`
          );
          assert.strictEqual(
            rewardAmountFromLog,
            REWARD_WEI,
            `Reward amount should be ${REWARD_WEI}`
          );
          return instance.getBalance.call(owner, { from: owner } );
      })
      .then(actualOwnerBalance => {
          assert.equal(actualOwnerBalance, expectedOwnerBalance, `Owner should have ${expectedOwnerBalance}`);
          return instance.getBalance.call(recipient, { from: owner } );
      })
      .then(actualRecipientBalance => {
          assert.equal(actualRecipientBalance, expectedRecipientBalance, `Recipient should have ${expectedRecipientBalance}`);
          return;
      });
  });

  it('should only allow owner to reward', function() {
    const REWARD_WEI = 50;
    let instance;

    return TaskMaster.deployed()
      .then(_instance => {
        instance = _instance;
        return expectedExceptionPromise(
          () => instance.reward(recipient, REWARD_WEI, { from: recipient, gas: 3000000 }),
          3000000
        );
      })
  });

  it('should not be able to reward recipient with reward that exceeds owner balance', function() {
    const REWARD_WEI = 10001;
    let instance;

    return TaskMaster.deployed()
      .then(_instance => {
        instance = _instance;
        return expectedExceptionPromise(
          () => instance.reward(recipient, REWARD_WEI, { from: owner, gas: 3000000 }),
          3000000
        );
      })
  });
});
