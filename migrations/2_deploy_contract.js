var MaterialProvider = artifacts.require("./MaterialProvider.sol");
var ProjectOffice = artifacts.require("./ProjectOffice.sol");

module.exports = function(deployer) {
  deployer.deploy(ProjectOffice)
  .then(function(){
    return deployer.deploy(MaterialProvider);
  });
};