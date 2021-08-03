const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 低电平
 */
class LowLevel extends SimpleLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 输出端口
        this._pinOut = this.addPin('out', this._bitWidth, PinDirection.output);

        // 创建输出信号
        this._signalLow = Signal.createLow(this._bitWidth);
    }

    // override
    updateModuleState() {
        this._pinOut.setSignal(this._signalLow);
    }
}

module.exports = LowLevel;