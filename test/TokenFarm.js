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

    describe('Farming tokens', async () => {

        it('rewards investors for staking mDai tokens', async () => {
            let result

            // Check investor balance before staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

            // Stake Mock DAI Tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
            await tokenFarm.stakeTokens(tokens('100'), { from: investor }) 
            //100 token stake ettim ve aşağıda her şeyini test ettim

            // Check staking result
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

            // Issue Tokens
            await tokenFarm.issueTokens({ from: owner })

            // Check balances after issuance
            result = await akcToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance')

            // Ensure that only onwer can issue tokens
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;
        })

    })
}) 