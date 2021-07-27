const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 接地
 * 输出低电平
 */
class Gnd extends SimpleLogicModule {

    // override
    init() {
        // 模块参数
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 创建输出信号
        this.lowSignal = Signal.createLow(bitWidth);
    }

    // override
    updateModuleState() {
        this.pinOut.setSignal(this.lowSignal);
    }
}

module.exports = Gnd;