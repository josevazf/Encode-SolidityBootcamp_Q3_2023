// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import {GetCode} from "./imported/get-code.sol";

contract AssemblyTest {
    using GetCode for address;

    function getThisCode() public view returns (bytes memory code) {
        return address(this).at();
    }
}
