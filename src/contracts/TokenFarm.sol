pragma solidity ^0.5.0;

import "./AkcToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Akc Token Farm";
    AkcToken public akcToken;
    DaiToken public daiToken;

    // mapping = key->value
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(AkcToken _akcToken, DaiToken _daiToken) public {
        akcToken = _akcToken;
        daiToken = _daiToken;
    }

    function stakeTokens(uint _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Trasnfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);
        //this = bu akıllı sözleşmenin kendisine karşılık gelir.
      
        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        //Kullanıcı daha önceden stake yapmadıysa onu stakers arr sine ekliyorum
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
}
