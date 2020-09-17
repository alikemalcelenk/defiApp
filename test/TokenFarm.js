const TokenFarm = artifacts.require("TokenFarm");
const AkcToken = artifacts.require("AkcToken");
const DaiToken = artifacts.require("DaiToken");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
    //n tane etheriumu wei ye çevir demek yani sonuna 18 tane sıfır yazıcaz 
}

contract('TokenFarm', (accounts) => {

    let daiToken, akcToken, tokenFarm
    const owner = accounts[0];  //deploy
    const investor = accounts[1]; //investor

    before(async () => {
        //parametreleri belirledik
        daiToken = await DaiToken.new()
        akcToken = await AkcToken.new()
        tokenFarm = await TokenFarm.new(akcToken.address, daiToken.address)

        // Transfer all tokens to TokenFarm (1 million)
        await akcToken.transfer(tokenFarm.address, tokens('1000000'))

        //Send tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner })
    })

    //TEST
    describe('Mock DAI Deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Akc Token Deployment', async () => {
        it('has a name', async () => {
            const name = await akcToken.name()
            assert.equal(name, 'Ali Kemal Celenk Token')
        })
    })

    describe('Token Farm Deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Akc Token Farm')
        })

        it('contract has tokens', async () => {
            let balance = await akcToken.balanceOf(tokenFarm.address)
            console.log(balance.toString())
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })
}) 