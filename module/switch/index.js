const { Signal, PinDirection, InteractiveLogicModule } = require('jslogiccircuit');

/**
 * 开关
 *
 */
class Switch extends InteractiveLogicModule {

    // override
    init() {
        // 初始状态
        this._data = 0;

        // 输出端口
        this._pinOut = this.addPin('out', 1, PinDirection.output);

        // 常量信号
        this._signalHigh = Signal.createHigh(1);
        this._signalLow = Signal.createLow(1);
    }

    // override
    updateModuleState() {
        this._pinOut.setSignal(this._signalHigh);
    }
}

module.exports = Switch;