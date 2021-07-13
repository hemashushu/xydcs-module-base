const { Binary } = require('jsbinary');
const { Signal } = require('jslogiccircuit');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class XorGate extends AbstractBaseLogicModule {

    init() {
        // 模块参数
        let inputPinCount = this.getParameter('inputPinCount'); // 输入端口的数量
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.addOutputPinByDetail('out', bitWidth);

        // 输入端口的名称分别为 in0, in1, ... inN
        let createInputPin = (idx) => {
            this.addInputPinByDetail('in' + idx, bitWidth);
        };

        // 输入端口
        for (let idx = 0; idx < inputPinCount; idx++) {
            createInputPin(idx);
        }
    }

    getModuleClassName() {
        return 'xor_gate'; // 同目录名
    }

    // override
    updateModuleStateAndOutputPinsSignal() {
        let binaries = this.inputPins.map(pin => {
            return pin.getSignal().getBinary();
        });

        // 当输入端口大于 2 时，后续的输入端口会依次进行 xor 运算，即
        // out = (a xor b) xor c
        //
        // https://en.wikipedia.org/wiki/XOR_gate#More_than_two_inputs

        let resultBinary = binaries[0];
        for (let idx = 1; idx < binaries.length; idx++) {
            resultBinary = Binary.xor(resultBinary, binaries[idx]);
        }

        let resultSignal = Signal.createWithoutHighZ(this.outputPins[0].bitWidth, resultBinary);
        this.outputPins[0].setSignal(resultSignal);
    }
}

module.exports = XorGate;