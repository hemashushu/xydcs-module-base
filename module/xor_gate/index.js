const { Binary } = require('jsbinary');
const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 异或门
 */
class XorGate extends SimpleLogicModule {

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
        // 当输入端口大于 2 时：
        //
        // 实现方案 A：
        // 后续的输入端口会依次进行 xor 运算，即
        // out = (a xor b) xor c
        // https://en.wikipedia.org/wiki/XOR_gate#More_than_two_inputs
        //
        // 实现方案 B：
        // 一次过计算所有输入端口，只要有相异的就为 1,只有全部相同才为 0,即
        // m = OR(in_0, in_1,...)        <-- 全为 0 的才为 0
        // n = NOT(AND(in_0, in_1,...))  <-- NOT(全为 1 的才为 1) = 全为 1 的才为 0
        // Q = m AND n
        //
        // 目前采用的是方案 A。

        let states = this.inputPins.map(pin => {
            return pin.getSignal().getState();
        });

        let state = states[0];
        let resultBinary = Binary.and(state.binary, Binary.not(state.highZ));

        for (let idx = 1; idx < states.length; idx++) {
            state = states[idx];
            let currentBinary = Binary.and(state.binary, Binary.not(state.highZ));
            resultBinary = Binary.xor(resultBinary, currentBinary);
        }

        let resultSignal = Signal.createWithoutHighZ(this.pinOut.bitWidth, resultBinary);
        this.pinOut.setSignal(resultSignal);
    }
}

module.exports = XorGate;