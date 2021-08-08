const { Signal, PinDirection, InteractiveLogicModule } = require('jslogiccircuit');

/**
 * 开关
 *
 */
class Switch extends InteractiveLogicModule {

    // override
    init() {

        // 初始状态
        this._initialValue = this.getParameter('initialValue');

        // 输出端口
        this._pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 常量信号
        this._signalInitial = (this._initialValue === 1) ?
            Signal.createHigh(1) :
            Signal.createLow(1);
    }

    // override
    updateModuleState() {
        this._pinOut.setSignal(this._signalInitial);
    }
}

module.exports = Switch;