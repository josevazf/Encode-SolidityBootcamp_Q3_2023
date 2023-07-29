// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    constructor () {}
    
    /// @notice 
    function helloWorld() public pure returns (string memory) {
        return "Hello world!";
    }
}