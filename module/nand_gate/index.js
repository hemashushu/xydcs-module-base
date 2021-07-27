const { Binary } = require('jsbinary');
const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 与非门
 */
class NandGate extends SimpleLogicModule {

    // override
    init() {
        // 模块参数
        let inputPinCount = this.getParameter('inputPinCount'); // 输入端口的数量
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 输入端口的名称分别为 in_0, in_1, ... in_N
        for (let idx = 0; idx < inputPinCount; idx++) {
            this.addPin('in_' + idx, bitWidth, PinDirection.input);
        }
    }

    // override
    updateModuleState() {
        let states = this.inputPins.map(pin => {
            return pin.getSignal().getState();
        });

        let state = states[0];
        let resultBinary = Binary.and(state.binary, Binary.not(state.highZ));

        for (let idx = 1; idx < states.length; idx++) {
            state = states[idx];
            let currentBinary = Binary.and(state.binary, Binary.not(state.highZ));
            resultBinary = Binary.and(resultBinary, currentBinary);
        }

        resultBinary = Binary.not(resultBinary);
        let resultSignal = Signal.createWithoutHighZ(this.pinOut.bitWidth, resultBinary);

        this.pinOut.setSignal(resultSignal);
    }
}

module.exports = NandGate;