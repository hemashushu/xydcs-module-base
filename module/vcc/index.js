const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 电源正极
 * 输出高电平的端口
 */
class Vcc extends SimpleLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 输出端口
        this._pinOut = this.addPin('out', this._bitWidth, PinDirection.output);

        // 创建输出信号
        this._signalHigh = Signal.createHigh(this._bitWidth);
    }

    // override
    updateModuleState() {
        this._pinOut.setSignal(this._signalHigh);
    }
}

module.exports = Vcc;