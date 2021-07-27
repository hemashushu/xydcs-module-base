const { Binary } = require('jsbinary');
const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 非门
 */
class NotGate extends SimpleLogicModule {

    // override
    init() {
        // 模块参数
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 输入端口
        this.pinIn = this.addPin('in', bitWidth, PinDirection.input);
    }

    // override
    updateModuleState() {
        let state = this.pinIn.getSignal().getState();
        let resultBinary = Binary.and(state.binary, Binary.not(state.highZ));
        resultBinary = Binary.not(resultBinary);

        let resultSignal = Signal.createWithoutHighZ(this.pinOut.bitWidth, resultBinary);
        this.pinOut.setSignal(resultSignal);
    }
}

module.exports = NotGate;