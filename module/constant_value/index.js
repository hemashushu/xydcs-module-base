const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');
const { Binary } = require('jsbinary');

/**
 * 常量
 * 输出固定的信号值
 */
class ConstantValue extends SimpleLogicModule {

    // override
    init() {
        // 常数值
        this._value = this.getParameter('value');

        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 输出端口
        this._pinOut = this.addPin('out', this._bitWidth, PinDirection.output);

        // 创建输出信号
        let valueBinary = Binary.fromInt32(this._value, this._bitWidth);
        this._signalValue = Signal.createWithoutHighZ(this._bitWidth, valueBinary);
    }

    // override
    updateModuleState() {
        this._pinOut.setSignal(this._signalValue);
    }
}

module.exports = ConstantValue;