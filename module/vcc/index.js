const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 电源正极
 * 输出高电平的端口
 */
class Vcc extends SimpleLogicModule {

    // override
    init() {
        // 模块参数
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 创建输出信号
        this.highSignal = Signal.createHigh(bitWidth);
    }

    // override
    updateModuleState() {
        this.pinOut.setSignal(this.highSignal);
    }
}

module.exports = Vcc;