const { Signal, PinDirection, InteractiveLogicModule } = require('jslogiccircuit');

/**
 * 按钮
 *
 */
class Button extends InteractiveLogicModule {

    // override
    init() {
        // 反转输出信号
        //
        // 默认输出低电平，点击输出高电平。
        // 反转之后
        // 默认输出高电平，点击输出低电平。
        this._invertOutput = this.getParameter('invertOutput');

        // 输出端口
        this._pinOut = this.addPin('out', 1, PinDirection.output);

        // 常量信号
        this._signalHigh = Signal.createHigh(1);
        this._signalLow = Signal.createLow(1);
    }

    // override
    updateModuleState() {
        if (this._invertOutput) {
            this._pinOut.setSignal(this._signalHigh);
        } else {

            this._pinOut.setSignal(this._signalLow);
        }
    }
}

module.exports = Button;