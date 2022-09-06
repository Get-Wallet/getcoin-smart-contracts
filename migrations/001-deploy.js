const Getcoin = artifacts.require('Getcoin');

const {
    deployProxy
} = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
    await deployer.deploy(Getcoin);
    await deployProxy(Getcoin, [], {deployer, initializer: 'initialize'});
};
