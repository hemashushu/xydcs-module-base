const { Binary } = require('jsbinary');
const { Signal, PinDirection } = require('jslogiccircuit');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class NotGate extends AbstractBaseLogicModule {

    init() {
        // 模块参数
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 输入端口
        this.pinIn = this.addPin('in', bitWidth, PinDirection.input);
    }

    getModuleClassName() {
        return 'not_gate'; // 同目录名
    }

    // override
    updateModuleState() {
        let binary = this.pinIn.getSignal().getBinary();
        let resultBinary = Binary.not(binary);

        let resultSignal = Signal.createWithoutHighZ(this.pinOut.bitWidth, resultBinary);
        this.pinOut.setSignal(resultSignal);
    }
}

module.exports = NotGate;