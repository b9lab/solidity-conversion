pragma solidity ^0.4.13;

contract Conversion {
    function convertToInt(uint a) public returns (int b) {
		b = int(a);
    }

    function convertToUint(int b) public returns (uint c) {
        c = uint(b);
    }
}