const { SimpleLogicModule, Signal, PinDirection, ShortCircuitException } = require('jslogiccircuit');
const { Binary } = require('jsbinary');

/**
 * 并联器
 *
 * - 目前 Pin 只支持数据最宽 32 位
 * - 目前 Pin 只支持单线路输入，
 *   可以通过本模块（并联模块）来实现多条线路输入，并联模块
 *   会判断有无短路的情况，然后选择非高阻抗的输入信号作为输出信号。
 */
class Parallel extends SimpleLogicModule {

    // override
    init() {
        // 输入端口的数量
        this._inputPinCount = this.getParameter('inputPinCount');

        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 输出端口
        this._pinOut = this.addPin('out', this._bitWidth, PinDirection.output);

        // 输入端口的名称分别为 in_0, in_1, ... in_N
        for (let idx = 0; idx < this._inputPinCount; idx++) {
            this.addPin('in_' + idx, this._bitWidth, PinDirection.input);
        }
    }

    // override
    updateModuleState() {
        let firstPin = this.inputPins[0];

        let levelInt32Out;
        let highZInt32Out;

        // 只考虑数据最宽 32 位的情况。

        let signalPrevious = firstPin.getSignal()
        let levelInt32Previous = signalPrevious.getLevel().toInt32();
        let highZInt32Previous = signalPrevious.getHighZ().toInt32();

        for (let idx = 1; idx < this.inputPins.length; idx++) {
            let signalNext = this.inputPins[idx].getSignal()
            let levelInt32Next = signalNext.getLevel().toInt32();
            let highZInt32Next = signalNext.getHighZ().toInt32();

            // 短路的判断：
            // 1. 双方都不是高阻抗
            // 2. 值不同
            let bothValid = ~(highZInt32Previous | highZInt32Next);
            let diffV = levelInt32Previous ^ levelInt32Next;
            let conflict = bothValid & diffV;

            if (conflict !== 0) {
                throw new ShortCircuitException(undefined, [this]);
            }

            levelInt32Out = (levelInt32Previous & ~highZInt32Previous) | (levelInt32Next & ~highZInt32Next); // 将高阻抗当作低电平
            highZInt32Out = highZInt32Previous & highZInt32Next; // 两者都为高阻抗时结果才高阻抗

            levelInt32Previous = levelInt32Out;
            highZInt32Previous = highZInt32Out
        }

        let bitWidth = this._bitWidth;
        let signalResult = Signal.create(bitWidth,
            Binary.fromInt32(levelInt32Out, bitWidth),
            Binary.fromInt32(highZInt32Out, bitWidth));

        this._pinOut.setSignal(signalResult);
    }
}


module.exports = Parallel;