const Web3 = require('web3');
const contract = require('truffle-contract');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const SimpleStorageContract = require('./build/contracts/SimpleStorage.json');
const simpleStorage = contract(SimpleStorageContract)
simpleStorage.setProvider(web3.currentProvider)
if (typeof simpleStorage.currentProvider.sendAsync !== "function") {
  simpleStorage.currentProvider.sendAsync = function() {
    return simpleStorage.currentProvider.send.apply(
      simpleStorage.currentProvider, arguments
    );
  };
}

var simpleStorageInstance, firstAccount;

web3.eth.getAccounts()
  .then(function (accounts) {
    accounts = accounts;
    console.log(JSON.stringify(accounts, null, 2));
    return accounts;
  })
  .then(function (accounts) {
    firstAccount = accounts[0];
    return web3.eth.getBalance(firstAccount);
  })
  .then(function (accountBalance) {
    console.log('balance in wei: ', accountBalance);
    console.log('balance in ether: ', web3.utils.fromWei(accountBalance, 'ether'));
    return accountBalance;
  })
  .then(function () {
    return simpleStorage.deployed();
  })
  .then(function (instance) {
    simpleStorageInstance = instance;
    return simpleStorageInstance.set(5, {from: firstAccount});
  })
  .then(function (result) {
    return simpleStorageInstance.get.call({
      from:firstAccount
    });
  })
  .then(function (result) {
    console.log(+result)
    return result;
  })
  .catch(function (error) {
    console.error(error);
  });
