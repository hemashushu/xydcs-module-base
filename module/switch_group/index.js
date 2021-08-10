const { Binary } = require('jsbinary');
const { Signal, PinDirection, InteractiveLogicModule } = require('jslogiccircuit');

/**
 * 开关
 *
 */
class SwitchGroup extends InteractiveLogicModule {

    // override
    init() {

        // 开关的数量
        // 开关的数量决定输出端口的位宽
        this._switchCount = this.getParameter('switchCount');

        // 输出端口
        this._pinOut = this.addPin('out', this._switchCount, PinDirection.output);

        // 初始值
        this._data = 0;
    }

    // override
    updateModuleState() {
        let signal = Signal.createWithoutHighZ(
            this._switchCount,
            Binary.fromInt32(0, this._switchCount));

        this._pinOut.setSignal(signal);
    }
}

module.exports = SwitchGroup;