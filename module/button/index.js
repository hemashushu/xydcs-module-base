const { Signal, PinDirection, InteractiveLogicModule } = require('jslogiccircuit');

/**
 * 按钮
 *
 * 可以通过设置 bitWidth 大于 1 以实现按钮阵列。
 */
class Button extends InteractiveLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 反转输出信号
        // 默认输出低电平，点击输出高电平。反转之后
        // 默认输出高电平，点击输出低电平。
        this._invertOutput = this.getParameter('invertOutput');

        // 输出端口
        this._pinOut = this.addPin('out', this._bitWidth, PinDirection.output);

        this._signalHigh = Signal.createHigh(bitWidth);
        this._signalLow = Signal.createLow(bitWidth);
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