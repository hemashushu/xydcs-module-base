const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 切分器
 * 将多位宽的线（可理解为捆绑在一起的一组线）分隔为多组（多条）线。
 *
 * 切分器也常用来将一条多位宽的线，转换为多条 1 位宽的线。
 * 比如：
 * 一条 4 bit width 的线 -> 4 条 1 bit width 的线。
 */
class Splitter extends SimpleLogicModule {

    // override
    init() {

        // 输入端口的位宽
        this._inputBitWidth = this.getParameter('inputBitWidth');

        // 切分情况 [{from, to}, {from, to}, ...]
        this._outputPinBitRanges = this.getParameter('outputPinBitRanges');

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
        this._outputPinBitRanges.reverse();

        // 输入端口
        this._pinIn = this.addPin('in', this._inputBitWidth, PinDirection.input);

        // 输出端口的名称分别为 out_0, out_1, ... out_N
        for (let idx = 0; idx < this._outputPinBitRanges.length; idx++) {
            let bitRange = this._outputPinBitRanges[idx];
            let outputBitWidth = bitRange.from - bitRange.to + 1;
            this.addPin('out_' + idx, outputBitWidth, PinDirection.output);
        }
    }

    // override
    updateModuleState() {
        let { level, highZ } = this._pinIn.getSignal().getState();

        for (let idx = 0; idx < this._outputPinBitRanges.length; idx++) {
            let bitRange = this._outputPinBitRanges[idx];
            let outputBitWidth = bitRange.from - bitRange.to + 1;

            let levelPart = level.slice(bitRange.to, outputBitWidth);
            let highZPart = highZ.slice(bitRange.to, outputBitWidth);
            let signalOut = Signal.create(outputBitWidth, levelPart, highZPart);

            this.outputPins[idx].setSignal(signalOut);
        }
    }
}

module.exports = Splitter;