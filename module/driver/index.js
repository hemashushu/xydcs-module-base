const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 驱动器
 * 当 select 端口高电平时，输入输出导通，否则端口且输出高阻抗。
 */
class Driver extends SimpleLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 输入端口
        this._pinIn = this.addPin('in', this._bitWidth, PinDirection.input);

        // 选择端口
        this._pinSelect = this.addPin('select', 1, PinDirection.input);

        // 输出端口
        this._pinOut = this.addPin('out', this._bitWidth, PinDirection.output);

        // 常量信号
        this._signalHigh = Signal.createHigh(1);
        this._signalHighZ = Signal.createHighZ(this._bitWidth);
    }

    // override
    updateModuleState() {
        if (Signal.equal(this._pinSelect.getSignal(), this._signalHigh)) {
            this._pinOut.setSignal(this._pinIn.getSignal());
        } else {
            this._pinOut.setSignal(this._signalHighZ);
        }
    }
}

module.exports = Driver;