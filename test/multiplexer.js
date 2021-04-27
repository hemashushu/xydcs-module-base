const { Binary } = require('jsbinary');

const Multiplexer = require('../multiplexer');

var assert = require('assert/strict');

describe('Multiplexer Test', () => {
    it('Test control signal change', () => {
        let m1 = new Multiplexer('multiplexer1', 4, 2);

        assert.equal(m1.inputWires.length, 4 + 1); // additional one control wire

        let inputWire0 = m1.getInputWire('in0');
        let inputWire1 = m1.getInputWire('in1');
        let inputWire2 = m1.getInputWire('in2');
        let inputWire3 = m1.getInputWire('in3');
        let outputWire = m1.getOutputWire('out');

        assert.equal(outputWire.dataWidth, 4);
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('0000', 4)));

        let data0 = Binary.fromBinaryString('1000', 4);
        let data1 = Binary.fromBinaryString('1001', 4);
        let data2 = Binary.fromBinaryString('1010', 4);
        let data3 = Binary.fromBinaryString('1011', 4);

        inputWire0.setData(data0)
        inputWire1.setData(data1)
        inputWire2.setData(data2)
        inputWire3.setData(data3)

        let controlWire = m1.getInputWire('control');

        controlWire.setData(Binary.fromBinaryString('00', 2));
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1000', 4)));

        controlWire.setData(Binary.fromBinaryString('01', 2));
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1001', 4)));

        controlWire.setData(Binary.fromBinaryString('10', 2));
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1010', 4)));

        controlWire.setData(Binary.fromBinaryString('11', 2));
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1011', 4)));
    });

    it('Test input wire data change', () => {
        let m1 = new Multiplexer('multiplexer1', 4, 2);

        let inputWire0 = m1.getInputWire('in0');
        let inputWire1 = m1.getInputWire('in1');
        let inputWire2 = m1.getInputWire('in2');
        let inputWire3 = m1.getInputWire('in3');
        let outputWire = m1.getOutputWire('out');

        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('0000', 4)));

        let data0 = Binary.fromBinaryString('1001', 4);
        let data1 = Binary.fromBinaryString('1111', 4);

        inputWire0.setData(data0)
        inputWire1.setData(data0)
        inputWire2.setData(data0)
        inputWire3.setData(data0)

        let controlWire = m1.getInputWire('control');

        controlWire.setData(Binary.fromBinaryString('01', 2)); // select input wire 1
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1001', 4)));

        inputWire0.setData(data1); // change wire 0 data
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1001', 4)));

        inputWire2.setData(data1); // change wire 2 data
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1001', 4)));

        inputWire3.setData(data1); // change wire 3 data
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1001', 4)));

        inputWire1.setData(data1); // change wire 1 data
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('1111', 4)));

    });
});