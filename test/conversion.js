const Conversion = artifacts.require("./Conversion.sol");

contract('Conversion', function(accounts) {

  let conversion;

  beforeEach("should deploy a new instance", function() {
    return Conversion.new({ from: accounts[0] })
      .then(created => conversion = created);
  });

  it("should convert small positive numbers without issue", function() {
    return conversion.convertToInt.call(0)
      .then(function(converted1) {
        assert.strictEqual(converted1.toNumber(), 0, "0 wasn't converted");
        return conversion.convertToInt.call(1000);
      })
      .then(function(converted2) {
        assert.strictEqual(converted2.toNumber(), 1000, "1000 wasn't converted");
        return conversion.convertToUint.call(0);
      })
      .then(function(converted) {
        assert.strictEqual(converted.toNumber(), 0, "0 wasn't converted");
        return conversion.convertToUint.call(1000);
      })
      .then(function(converted) {
        assert.strictEqual(converted.toNumber(), 1000, "1000 wasn't converted");
      });

  });

  it("should convert negative numbers to large positive ones", function() {
    return conversion.convertToUint.call(-1)
      .then(function(converted) {
        assert.strictEqual(
          converted.toString(16).toUpperCase(),
          "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
          "-1 wasn't converted to a large unit");
        return conversion.convertToUint.call(-2);
      })
      .then(function(converted) {
        assert.strictEqual(
          converted.toString(16).toUpperCase(), 
          "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE",
          "-2 wasn't converted to a large uint");
      });

  });

  it("should convert large positive numbers to negative ones", function() {
    return conversion.convertToInt.call(web3.toBigNumber("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"))
      .then(function(converted) {
        assert.strictEqual(
          converted.toString(10),
          "-1",
          "Large number wasn't converted to -1");
        return conversion.convertToInt.call(web3.toBigNumber("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE"));
      })
      .then(function(converted) {
        assert.strictEqual(
          converted.toString(10), 
          "-2",
          "Large number wasn't converted to -2");
        return conversion.convertToInt.call(web3.toBigNumber("0x0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"));
      })
      .then(function(converted) {
        assert.strictEqual(
          converted.toString(16).toUpperCase(), 
          "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
          "Large number should have been ok");
        return conversion.convertToInt.call(web3.toBigNumber("0x1000000000000000000000000000000000000000000000000000000000000000"));
      })
      .then(function(converted) {
        assert.strictEqual(
          converted.toString(16).toUpperCase(), 
          "-F000000000000000000000000000000000000000000000000000000000000000",
          "Large number should have been ok");
      });

  });

});
