const { Binary } = require('jsbinary');

const AndGate = require('../src/logicmodule/andgate');

var assert = require('assert/strict');

describe('And Gate Test', () => {
    it('2 inputs', () => {
        let a1 = new AndGate('andGate1', 2);

        assert.equal(a1.inputWires.length, 2);

        let inputWire0 = a1.getInputWire('in0');
        let inputWire1 = a1.getInputWire('in1');
        let outputWire = a1.getOutputWire('out');

        assert.equal(outputWire.dataWidth, 1);
        assert.equal(outputWire.data.value, 0);

        let data0 = Binary.fromBinaryString('0', 1);
        let data1 = Binary.fromBinaryString('1', 1);

        inputWire0.setData(data1);
        inputWire1.setData(data0)
        assert.equal(outputWire.data.value, 0);

        inputWire0.setData(data1);
        inputWire1.setData(data1)
        assert.equal(outputWire.data.value, 1);

        inputWire0.setData(data0);
        inputWire1.setData(data1)
        assert.equal(outputWire.data.value, 0);

        inputWire0.setData(data0);
        inputWire1.setData(data0)
        assert.equal(outputWire.data.value, 0);
    });

    it('4 inputs', () => {
        let a1 = new AndGate('andGate1', 4);

        assert.equal(a1.inputWires.length, 4);

        let inputWire0 = a1.getInputWire('in0');
        let inputWire1 = a1.getInputWire('in1');
        let inputWire2 = a1.getInputWire('in2');
        let inputWire3 = a1.getInputWire('in3');
        let outputWire = a1.getOutputWire('out');

        assert.equal(outputWire.data.value, 0);

        let data0 = Binary.fromBinaryString('0', 1);
        let data1 = Binary.fromBinaryString('1', 1);

        inputWire0.setData(data1);
        inputWire1.setData(data0)
        inputWire2.setData(data1);
        inputWire3.setData(data0)
        assert.equal(outputWire.data.value, 0);

        inputWire1.setData(data1);
        inputWire3.setData(data1)
        assert.equal(outputWire.data.value, 1);

        inputWire0.setData(data0);
        assert.equal(outputWire.data.value, 0);

        inputWire0.setData(data1);
        assert.equal(outputWire.data.value, 1);

        inputWire1.setData(data0);
        assert.equal(outputWire.data.value, 0);
    });
});