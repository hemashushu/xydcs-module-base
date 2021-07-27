const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 切分器
 */
class Splitter extends SimpleLogicModule {

    // override
    init() {
        // 模块参数
        let inputBitWidth = this.getParameter('inputBitWidth');
        let outputPinBitRanges = this.getParameter('outputPinBitRanges'); // 切分情况 [{from, to}, {from, to}, ...]

        // 反转数组以得到正确的端口名称的序号
        // 即，在配置文件中，
        // 先出现的端口的名称的序号越大（如 out_7）
        // 后出现的端口的名称的序号越小（如 out_0）
        //
        // 比如：
        // - from: 7   # out_2, 5 bits
        //   to: 3     #
        // - from: 2   # out_1, 2 bits
        //   to: 1     #
        // - from: 0   # out_0, 1 bits
        //   to: 0     #
        outputPinBitRanges.reverse();

        // 输入端口
        this.pinIn = this.addPin('in', inputBitWidth, PinDirection.input);

        // 输出端口的名称分别为 out_0, out_1, ... out_N
        for (let idx = 0; idx < outputPinBitRanges.length; idx++) {
            let bitRange = outputPinBitRanges[idx];
            let outputBitWidth = bitRange.from - bitRange.to + 1;
            this.addPin('out_' + idx, outputBitWidth, PinDirection.output);
        }

        this.outputPinBitRanges = outputPinBitRanges;
    }

    // override
    updateModuleState() {
        let outputPins = this.getOutputPins();
        let { binary, highZ } = this.pinIn.getSignal().getState();

        for (let idx = 0; idx < this.outputPinBitRanges.length; idx++) {
            let bitRange = this.outputPinBitRanges[idx];
            let outputBitWidth = bitRange.from - bitRange.to + 1;

            let partBinary = binary.slice(bitRange.to, outputBitWidth);
            let partHighZ = highZ.slice(bitRange.to, outputBitWidth);
            let outputSignal = Signal.create(outputBitWidth, partBinary, partHighZ);

            outputPins[idx].setSignal(outputSignal);
        }
    }
}

module.exports = Splitter;