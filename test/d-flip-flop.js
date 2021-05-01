const { Binary } = require('jsbinary');

const DFlipFlop = require('../d-flip-flop');

var assert = require('assert/strict');

describe('D Flip Flop Test', () => {
    it('Base', () => {
        let r1 = new DFlipFlop('register1', {
            bitWidth:4
        });

        let inputWire = r1.getInputWire('D');
        let clockWire = r1.getInputWire('clock');
        let outputWire = r1.getOutputWire('Q');

        assert.equal(inputWire.bitWidth, 4);
        assert.equal(outputWire.bitWidth, 4);

        let b0 = Binary.fromBinaryString('0000', 4);
        assert(Binary.equals(outputWire.data, b0));

        // 高低电平
        let high = new Binary(1,1);
        let low = new Binary(0,1);

        let b1 = Binary.fromBinaryString('1001', 4);
        let b2 = Binary.fromBinaryString('1111', 4);

        // 上升沿
        inputWire.setData(b1);
        assert(Binary.equals(outputWire.data, b0));
        clockWire.setData(high);
        assert(Binary.equals(outputWire.data, b1));

        // 下降沿
        inputWire.setData(b2);
        assert(Binary.equals(outputWire.data, b1));
        clockWire.setData(low);
        assert(Binary.equals(outputWire.data, b1));

        // 上升沿 2
        clockWire.setData(high);
        assert(Binary.equals(outputWire.data, b2));
    });
});