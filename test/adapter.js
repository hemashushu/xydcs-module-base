const { Binary } = require('jsbinary');

const Adapter = require('../adapter');

var assert = require('assert/strict');

describe('Adapter Test', () => {
    it('Base', () => {
        let a1 = new Adapter('adapter1', {
            bitWidth: 4,
            sourceBitWidth: 12,
            sourceBitOffset: 4
        });

        let inputWire = a1.getInputWire('in');
        let outputWire = a1.getOutputWire('out');

        assert.equal(inputWire.bitWidth, 12);
        assert.equal(outputWire.bitWidth, 4);

        let b1 = Binary.fromBinaryString('100011110000', 12);
        inputWire.setData(b1);
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1111', 4)));

        let b2 = Binary.fromBinaryString('100000000000', 12);
        inputWire.setData(b2);
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('0000', 4)));

        let b3 = Binary.fromBinaryString('100110011000', 12);
        inputWire.setData(b3);
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1001')));
    });
});