const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');
const { Binary } = require('jsbinary');

/**
 * 常量
 * 输出固定的信号值
 */
class ConstantValue extends SimpleLogicModule {

    // override
    init() {
        // 模块参数
        let value = this.getParameter('value'); // 常数值
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 创建输出信号
        let constantBinary = Binary.fromInt32(value, bitWidth);
        this.constantSignal = Signal.createWithoutHighZ(bitWidth, constantBinary);
    }

    // override
    updateModuleState() {
        this.pinOut.setSignal(this.constantSignal);
    }
}

module.exports = ConstantValue;