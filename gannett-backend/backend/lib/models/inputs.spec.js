const Inputs = require('./inputs');

describe('Inputs model', function() {
  var inputs;

  beforeEach(function(done) {
    inputs = Inputs();
    done();
  });

  it('should initialize empty', function() {
    expect(inputs.getInputs()).to.be.empty;
  });

  it('should return an array', function() {
    expect(inputs.getInputs()).to.be.instanceof(Array);
  });

  it('should contain should accept a single number and contain it', function() {
    inputs.add(3);
    expect(inputs.getInputs()).to.deep.equal([3]);
  });

  it('should contain should accept a single float and contain it', function() {
    inputs.add(3.5);
    expect(inputs.getInputs()).to.deep.equal([3.5]);
  });

  it('should contain should accept both numbers and floats and contain them', function() {
    inputs.add(9);
    inputs.add(3.3);
    inputs.add(4);
    inputs.add(7.2)
    expect(inputs.getInputs()).to.deep.equal([9, 3.3, 4, 7.2]);
  });

  it('should throw an error if client attempts to add a non-finite value to the object', function() {
    expect(inputs.add.bind(inputs, 'abc')).to.throw(Error);
    expect(inputs.add.bind(inputs, [1, 2, '3'])).to.throw(Error);
    expect(inputs.add.bind(inputs, { do: 're-mi' })).to.throw(Error);
    expect(inputs.add.bind(inputs, 3)).to.not.throw(Error);
    expect(inputs.add.bind(inputs, 3.141592)).to.not.throw(Error);
    expect(inputs.getInputs()).to.deep.equal([3, 3.141592]);
  });

  it('should provide a sum of the inputs', function() {
    inputs.add(9);
    inputs.add(3);
    expect(inputs.getSum()).to.equal(12);
    inputs.add(1.5);
    expect(inputs.getSum()).to.equal(13.5);
  });
});
