const { Binary } = require('jsbinary');
const { SimpleLogicModule, Signal, PinDirection, ShortCircuitException } = require('jslogiccircuit');

/**
 * 多线路缩减器。
 *
 * 将多条线路并联（parallel）形成一条线路。
 *
 * 本模块可以多条线路信号同时输入，并只输出有效信号。有效信号是指：
 * - 多条输入端信号都同时为低电平（0），或者同时为高电平（1）
 * - 多条输入端信号除了一条或部分是相同的电平，其余线路都是高阻抗（z）
 * - 如果同一条线既有高电平，又有低电平信号，则被断定为短路，并抛出 ShortCircuitException 异常。
 *
 * 目前 Pin 只支持数据最宽 32 位。
 *
 */
class ParallelReduce extends SimpleLogicModule {

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
                // 短路
                throw new ShortCircuitException('Short circuit detected', [this]);
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


module.exports = ParallelReduce;