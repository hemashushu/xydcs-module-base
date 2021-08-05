const { SimpleLogicModule, Signal, PinDirection, ShortCircuitException } = require('jslogiccircuit');

/**
 * 扩展器
 *
 * 将一条 1 位宽的线路扩展为多为宽的线路。
 *
 * - 目前 Pin 只支持数据最宽 32 位。
 *
 */
class Expand extends SimpleLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        this._pinIn = this.addPin('in', 1, PinDirection.input);

        // 输出端口
        this._pinOut = this.addPin('out', this._bitWidth, PinDirection.output);

        // 创建一些常量
        this._signalLow = Signal.createLow(this._bitWidth);
        this._signalHigh = Signal.createHigh(this._bitWidth);
        this._signalHighZ = Signal.createHighZ(this._bitWidth);
    }

    // override
    updateModuleState() {

        let signal = this._pinIn.getSignal();
        let levelInt32 = signal.getLevel().toInt32();
        let highZInt32 = signal.getHighZ().toInt32();

        let signalResult;

        if (highZInt32 === 1) {
            signalResult = this._signalHighZ;
        }else if (levelInt32 === 1) {
            signalResult = this._signalHigh;
        }else {
            signalResult = this._signalLow;
        }

        this._pinOut.setSignal(signalResult);
    }
}


module.exports = Expand;