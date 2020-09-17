pragma solidity ^0.5.0;

import "./AkcToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Akc Token Farm";
    AkcToken public akcToken;
    DaiToken public daiToken;

    constructor(AkcToken _akcToken, DaiToken _daiToken) public {
        akcToken = _akcToken;
        daiToken = _daiToken;
    }
}
