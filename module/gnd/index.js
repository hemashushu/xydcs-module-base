const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 接地
 * 输出低电平
 */
class Gnd extends SimpleLogicModule {

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

module.exports = Gnd;