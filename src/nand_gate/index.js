const { Binary } = require('jsbinary');
const { Signal } = require('jslogiccircuit');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class NandGate extends AbstractBaseLogicModule {

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
        return 'nand_gate'; // 同目录名
    }

    // override
    updateModuleStateAndOutputPinsSignal() {
        let binaries = this.inputPins.map(pin => {
            return pin.getSignal().getBinary();
        });

        let resultBinary = binaries[0];
        for (let idx = 1; idx < binaries.length; idx++) {
            resultBinary = Binary.and(resultBinary, binaries[idx]);
        }

        resultBinary = Binary.not(resultBinary);

        let resultSignal = Signal.createWithoutHighZ(this.outputPins[0].bitWidth, resultBinary);
        this.outputPins[0].setSignal(resultSignal);
    }
}

module.exports = NandGate;