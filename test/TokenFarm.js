const TokenFarm = artifacts.require("TokenFarm");
const AkcToken = artifacts.require("AkcToken");
const DaiToken = artifacts.require("DaiToken");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TokenFarm', (accounts) => {

    //TEST
    describe('Mock DAI Deployment', async () => {
        it('has a name', async () => {
            let daiToken = await DaiToken.new()
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })
}) 