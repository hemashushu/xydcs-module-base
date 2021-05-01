const { Binary } = require('jsbinary');

const Combiner = require('../combiner');

var assert = require('assert/strict');

describe('Combiner Test', () => {
    it('Base', () => {
        let c1 = new Combiner('combiner1', {
            sourceBitWidths: [2,3,4]
        });

        assert.equal(c1.inputWires.length, 3);

        let inputWire0 = c1.getInputWire('in0');
        let inputWire1 = c1.getInputWire('in1');
        let inputWire2 = c1.getInputWire('in2');
        let outputWire = c1.getOutputWire('out');

        assert.equal(outputWire.bitWidth, 9);
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('000000000', 9)));

        let data0 = Binary.fromBinaryString('11', 2);
        let data1 = Binary.fromBinaryString('111', 3);
        let data2 = Binary.fromBinaryString('1010', 4);

        inputWire0.setData(data0)
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('110000000', 9)));

        inputWire1.setData(data1)
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('111110000', 9)));

        inputWire2.setData(data2)
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('111111010', 9)));

        let data1_r = Binary.fromBinaryString('000', 3);
        inputWire1.setData(data1_r)
        assert(Binary.equals(outputWire.data, Binary.fromBinaryString('110001010', 9)));
    });

});