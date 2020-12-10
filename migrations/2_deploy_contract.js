var MaterialProvider = artifacts.require("./MaterialProvider.sol");
var ProjectOffice = artifacts.require("./ProjectOffice.sol");

module.exports = function(deployer) {
  deployer.deploy(ProjectOffice);

  	// get the owner address
	const accounts = await web3.eth.getAccounts();
	const owner = accounts[0];
	// deploy the second, with address parameter
	deployer.deploy(MaterialProvider, owner);

};