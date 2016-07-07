contract('Conversion', function(accounts) {

  it("should convert small positive numbers without issue", function(done) {
    var conversion = Conversion.deployed();

    conversion.convertToInt.call(0)
      .then(function(converted1) {
        assert.equal(converted1.valueOf(), 0, "0 wasn't converted");
        return conversion.convertToInt.call(1000);
      })
      .then(function(converted2) {
        assert.equal(converted2.valueOf(), 1000, "1000 wasn't converted");
        return conversion.convertToUint.call(0);
      })
      .then(function(converted) {
        assert.equal(converted.valueOf(), 0, "0 wasn't converted");
        return conversion.convertToUint.call(1000);
      })
      .then(function(converted) {
        assert.equal(converted.valueOf(), 1000, "1000 wasn't converted");
      })
      .then(done)
      .catch(done);

  });

  it("should convert negative numbers to large positive ones", function(done) {
    var conversion = Conversion.deployed();

    conversion.convertToUint.call(-1)
      .then(function(converted) {
        assert.equal(
          converted.toString(16).toUpperCase(),
          "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
          "-1 wasn't converted to a large unit");
        return conversion.convertToUint.call(-2);
      })
      .then(function(converted) {
        assert.equal(
          converted.toString(16).toUpperCase(), 
          "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE",
          "-2 wasn't converted to a large uint");
      })
      .then(done)
      .catch(done);

  });

  it("should convert large positive numbers to negative ones", function(done) {
    var conversion = Conversion.deployed();

    conversion.convertToInt.call(web3.toBigNumber("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"))
      .then(function(converted) {
        assert.equal(
          converted.toString(10),
          "-1",
          "Large number wasn't converted to -1");
        return conversion.convertToInt.call(web3.toBigNumber("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE"));
      })
      .then(function(converted) {
        assert.equal(
          converted.toString(10), 
          "-2",
          "Large number wasn't converted to -2");
        return conversion.convertToInt.call(web3.toBigNumber("0x0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"));
      })
      .then(function(converted) {
        assert.equal(
          converted.toString(16).toUpperCase(), 
          "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
          "Large number should have been ok");
        return conversion.convertToInt.call(web3.toBigNumber("0x1000000000000000000000000000000000000000000000000000000000000000"));
      })
      .then(function(converted) {
        assert.equal(
          converted.toString(16).toUpperCase(), 
          "-F000000000000000000000000000000000000000000000000000000000000000",
          "Large number should have been ok");
      })
      .then(done)
      .catch(done);

  });

});
