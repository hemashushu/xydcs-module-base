const { Binary } = require('jsbinary');
const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 合并器
 * 将多条（多组）线捆绑（bundle）为一条多位宽的线
 *
 * 合并器也常用来将多条 1 位宽的线，转换为一条多位宽的线。
 * 比如：
 * 4 条 1 bit width 的线 -> 一条 4 bit width 的线。
 */
class Merge extends SimpleLogicModule {

    // override
    init() {
        // 每个输入引脚的位宽
        this._inputPinBitWidths = this.getParameter('inputPinBitWidths');

        // 反转数组以得到正确的端口名称的序号
        // 在配置文件中，
        // 先出现的条目的端口序号越大（比如 in_7），越靠近高位端。
        // 后出现的条目的端口序号越小（即 in_0），越靠近低位端。
        //
        // 比如 :
        // - 5 # in_2
        // - 2 # in_1
        // - 1 # in_0
        //
        // 对应输入端口 in_2, in_1, in_0 （位宽分别为 5, 2, 1） 合并为
        // [7:3,2:1,0:0]
        this._inputPinBitWidths.reverse();

        // 输出数据宽度
        this._outputBitWidth = 0;

        // 输入端口的名称分别为 in_0, in_1, ... in_N
        for (let idx = 0; idx < this._inputPinBitWidths.length; idx++) {
            let inputBitWidth = this._inputPinBitWidths[idx];
            this._outputBitWidth += inputBitWidth;
            this.addPin('in_' + idx, inputBitWidth, PinDirection.input);
        }

        // 输出端口
        this._pinOut = this.addPin('out', this._outputBitWidth, PinDirection.output);
    }

    // override
    updateModuleState() {
        let levelOut = Binary.fromInt32(0, this._outputBitWidth);
        let highZOut = Binary.fromInt32(0, this._outputBitWidth);

        let offset = 0;

        for (let idx = 0; idx < this.inputPins.length; idx++) {
            let inputPin = this.inputPins[idx];
            let { level, highZ } = inputPin.getSignal().getState();

            levelOut = levelOut.splice(offset, level);
            highZOut = highZOut.splice(offset, highZ);

            offset += inputPin.bitWidth;
        }

        let outputSignal = Signal.create(this._outputBitWidth, levelOut, highZOut);
        this._pinOut.setSignal(outputSignal);
    }
}

module.exports = Merge;