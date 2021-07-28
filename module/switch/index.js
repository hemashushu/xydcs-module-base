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
        // 模块参数
        this._bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 初始状态
        this._initialValue = this.getParameter('initialValue');

        // 输出端口
        this._pinOut = this.addPin('out', bitWidth, PinDirection.output);
    }

    // override
    updateModuleState() {
        let signal = Signal.createWithoutHighZ(this._bitWidth,
            Binary.fromInt32(this._initialValue, this._bitWidth));

        this._pinOut.setSignal(signal);
    }
}

module.exports = Switch;