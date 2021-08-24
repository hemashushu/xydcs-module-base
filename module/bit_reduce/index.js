const { SimpleLogicModule, Signal, PinDirection, ShortCircuitException } = require('jslogiccircuit');

/**
 * 缩减器
 *
 * 将 1 条多位宽的线路缩减为 1 条 1 位宽的线路
 *
 * - 在多位宽中，如果有部分位是高电平，又有部分位是低电平信号，则
 *   被断定为短路，并抛出 ShortCircuitException 异常。
 * - 目前 Pin 只支持数据最宽 32 位。
 *
 */
class BitReduce extends SimpleLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        this._pinIn = this.addPin('in', this._bitWidth, PinDirection.input);

        // 输出端口
        this._pinOut = this.addPin('out', 1, PinDirection.output);

        // 常量信号
        this._signalLow = Signal.createLow(1);
        this._signalHigh = Signal.createHigh(1);
        this._signalHighZ = Signal.createHighZ(1);
    }

    // override
    updateModuleState() {
        // 只考虑数据最宽 32 位的情况。
        let signal = this._pinIn.getSignal();
        let levelInt32 = signal.getLevel().toInt32();
        let highZInt32 = signal.getHighZ().toInt32();

        let result = -1; // 用 -1 表示高阻抗
        for (let idx = 1; idx < this._bitWidth; idx++) {
            let levelBit = levelInt32 & 1;
            let highZBit = highZInt32 & 1;

            if (highZBit !== 1) {
                if (result === -1) {
                    result = levelBit;
                }else if (result !== levelBit) {
                    // 短路
                    throw new ShortCircuitException('Short circuit detected.', [this]);
                }
            }

            levelInt32 = levelInt32 >> 1;
            highZInt32 = highZInt32 >> 1;
        }

        let signalResult;

        if (result === -1) {
            signalResult = this._signalHighZ;
        }else if (result === 1) {
            signalResult = this._signalHigh;
        }else {
            signalResult = this._signalLow;
        }

        this._pinOut.setSignal(signalResult);
    }
}


module.exports = BitReduce;