const { Binary } = require('jsbinary');

const NotGate = require('../src/logicmodule/notgate');

var assert = require('assert/strict');

describe('Not Gate Test', () => {
    it('Base', () => {
        let a1 = new NotGate('notGate1', 4, 12, 4);

        let inputWire = a1.getInputWire('in');
        let outputWire = a1.getOutputWire('out');

        assert.equal(inputWire.dataWidth, 1);
        assert.equal(outputWire.dataWidth, 1);

        let b0 = Binary.fromBinaryString('0', 1);
        let b1 = Binary.fromBinaryString('1', 1);

        inputWire.setData(b1);
        assert(Binary.equals(outputWire.data, b0));

        inputWire.setData(b0);
        assert(Binary.equals(outputWire.data, b1));
    });
});