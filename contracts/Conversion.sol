contract Conversion {
    function convertToInt(uint a) returns (int b) {
		b = int(a);
    }

    function convertToUint(int b) returns (uint c) {
        c = uint(b);
    }
}