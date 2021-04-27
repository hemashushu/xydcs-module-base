const { Binary } = require('jsbinary');

const Register = require('../src/logicmodule/register');

var assert = require('assert/strict');

describe('Register Test', () => {
    it('Base', () => {
        let r1 = new Register('register1', 4);

        let inputWire = r1.getInputWire('in');
        let outputWire = r1.getOutputWire('out');

        assert.equal(inputWire.dataWidth, 4);
        assert.equal(outputWire.dataWidth, 4);

        let b0 = Binary.fromBinaryString('0000', 4);
        assert(Binary.equals(outputWire.data, b0));

        let b1 = Binary.fromBinaryString('1001', 4);
        let b2 = Binary.fromBinaryString('1111', 4);

        inputWire.setData(b1);
        assert(Binary.equals(outputWire.data, b0));

        r1.pulse();
        assert(Binary.equals(outputWire.data, b1));

        inputWire.setData(b2);
        assert(Binary.equals(outputWire.data, b1));

        r1.pulse();
        assert(Binary.equals(outputWire.data, b2));
    });
});