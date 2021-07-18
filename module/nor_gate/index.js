const { Binary } = require('jsbinary');
const { Signal, PinDirection } = require('jslogiccircuit');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class NorGate extends AbstractBaseLogicModule {

    init() {
        // 模块参数
        let inputPinCount = this.getParameter('inputPinCount'); // 输入端口的数量
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 输入端口的名称分别为 in0, in1, ... inN
        let createInputPin = (idx) => {
            this.addPin('in' + idx, bitWidth, PinDirection.input);
        };

        // 输入端口
        for (let idx = 0; idx < inputPinCount; idx++) {
            createInputPin(idx);
        }
    }

    // override
    updateModuleState() {
        let binaries = this.inputPins.map(pin => {
            return pin.getSignal().getBinary();
        });

        let resultBinary = binaries[0];
        for (let idx = 1; idx < binaries.length; idx++) {
            resultBinary = Binary.or(resultBinary, binaries[idx]);
        }

        resultBinary = Binary.not(resultBinary);

        let resultSignal = Signal.createWithoutHighZ(this.pinOut.bitWidth, resultBinary);
        this.pinOut.setSignal(resultSignal);
    }
}

module.exports = NorGate;