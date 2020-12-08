var Materials = artifacts.require("./Materials.sol");

module.exports = function(deployer) {
  deployer.deploy(Materials);
};