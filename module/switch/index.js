const { Binary } = require('jsbinary');
const { Signal, PinDirection, InteractiveLogicModule } = require('jslogiccircuit');

/**
 * 开关
 *
 * 可以通过设置 bitWidth 大于 1 以实现开关阵列。
 */
class Switch extends InteractiveLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 初始状态
        this._initialValue = this.getParameter('initialValue');

        // 输出端口
        this._pinOut = this.addPin('out', bitWidth, PinDirection.output);

        this._signalInitial = Signal.createWithoutHighZ(this._bitWidth,
            Binary.fromInt32(this._initialValue, this._bitWidth));
    }

    // override
    updateModuleState() {
        this._pinOut.setSignal(this._signalInitial);
    }
}

module.exports = Switch;