import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import AkcToken from '../abis/AkcToken.json'
import TokenFarm from '../abis/TokenFarm.json'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',  //Account Address
      daiToken: {}, //Smart Contract
      akcToken: {}, //Smart Contract
      tokenFarm: {}, //Smart Contract
      daiTokenBalance: '0', //Dengeyi kurmak için. Dai Token bakiyesini alacağız. 
      akcTokenBalance: '0', //Dengeyi kurmak için. Akc Token bakiyesini alacağız. 
      stakingBalance: '0', //Stake yapılacak bakiye
      loading: true
    }
  }

  async componentWillMount() {
    await this.loadWeb3() //blockchaini uygulamaya bağladık.
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts() // Metamask(yatırımcı cüzdan ne kullanıyorsa) cüzdan adresini aldık
    this.setState({ account: accounts[0] })  

    const networkId = await web3.eth.net.getId() // Ganache = 5777 
    console.log(networkId) //5777

    // Load DaiToken
    const daiTokenData = DaiToken.networks[networkId]
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      console.log(daiToken) //Smart Contract
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
      console.log(daiTokenBalance) //Dai Token Balance   
    } else {
      window.alert('DaiToken contract not deployed to detected network.')
    }
    
    // Load AkcToken
    const akcTokenData = AkcToken.networks[networkId]
    if (akcTokenData) {
      const akcToken = new web3.eth.Contract(AkcToken.abi, akcTokenData.address)
      this.setState({ akcToken })
      console.log(akcToken) //Smart Contract
      let akcTokenBalance = await akcToken.methods.balanceOf(this.state.account).call()
      this.setState({ akcTokenBalance: akcTokenBalance.toString() })
      console.log(akcTokenBalance) //Akc Token Balance
    } else {
      window.alert('AkcToken contract not deployed to detected network.')
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId]
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarm })
      console.log(tokenFarm) //Smart Contract
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
      console.log(stakingBalance) //Token Farm Balance
    } else {
      window.alert('TokenFarm contract not deployed to detected network.')
    }

    this.setState({ loading: false })

  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
