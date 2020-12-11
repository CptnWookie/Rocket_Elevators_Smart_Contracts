var MaterialProvider = artifacts.require("./MaterialProvider.sol");
var ProjectOffice = artifacts.require("./ProjectOffice.sol");

module.exports = function(deployer,network, accounts ) {

  deployer.deploy(ProjectOffice, accounts[1]).then (  (ProjectOffice) => {
	    return deployer.deploy(MaterialProvider, accounts[0]);
  });


};