var Contest = artifacts.require("./contest.sol");

module.exports = function(deployer) {
  deployer.deploy(Contest);
};
