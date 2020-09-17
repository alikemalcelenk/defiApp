const TokenFarm = artifacts.require("TokenFarm");
const AkcToken = artifacts.require("AkcToken");
const DaiToken = artifacts.require("DaiToken");

module.exports = async function (deployer, network, accounts) {
    //Deploy Akc Token
    await deployer.deploy(AkcToken);
    const akcToken = await AkcToken.deployed()

    //Deploy Dai Token
    await deployer.deploy(DaiToken);
    const daiToken = await DaiToken.deployed()

    //Deploy Token Farm
    await deployer.deploy(TokenFarm, akcToken.address, daiToken.address);
    const tokenFarm = await TokenFarm.deployed()

    // Transfer all tokens to TokenFarm (1 million)
    await akcToken.transfer(tokenFarm.address, '1000000000000000000000000')

    // Transfer 100 Mock DAI tokens to investor
    //accounts[0] -> deployer adress
    //accounts[1] -> investor adress
    await daiToken.transfer(accounts[1], '100000000000000000000')
};