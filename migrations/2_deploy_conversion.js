const Conversion = artifacts.require("./Conversion.sol");

module.exports = function(deployer) {
    deployer.deploy(Conversion);
};
