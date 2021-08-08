const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 高电平输出
 */
class HighLevel extends SimpleLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 输出端口
        this._pinOut = this.addPin('out', this._bitWidth, PinDirection.output);

        // 常量信号
        this._signalHigh = Signal.createHigh(this._bitWidth);
    }

    // override
    updateModuleState() {
        this._pinOut.setSignal(this._signalHigh);
    }
}

module.exports = HighLevel;