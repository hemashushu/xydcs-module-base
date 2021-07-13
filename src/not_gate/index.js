const { Binary } = require('jsbinary');
const { Signal } = require('jslogiccircuit');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class NotGate extends AbstractBaseLogicModule {

    init() {
        // 模块参数
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.addOutputPinByDetail('out', bitWidth);

        // 输入端口
        this.addInputPinByDetail('in', bitWidth);
    }

    getModuleClassName() {
        return 'not_gate'; // 同目录名
    }

    // override
    updateModuleStateAndOutputPinsSignal() {
        let binary = this.inputPins[0].getSignal().getBinary();
        let resultBinary = Binary.not(binary);

        let resultSignal = Signal.createWithoutHighZ(this.outputPins[0].bitWidth, resultBinary);
        this.outputPins[0].setSignal(resultSignal);
    }
}

module.exports = NotGate;