const { Signal, PinDirection, InteractiveLogicModule } = require('jslogiccircuit');

/**
 * 按钮
 *
 * 可以通过设置 bitWidth 大于 1 以实现按钮阵列。
 */
class Button extends InteractiveLogicModule {

    // override
    init() {
        // 模块参数
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 反转输出信号
        // 默认输出低电平，点击输出高电平。反转之后
        // 默认输出高电平，点击输出低电平。
        this.invertOutput = this.getParameter('invertOutput');

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

    }

    // override
    updateModuleState() {
        if (this.invertOutput){
            let highSignal = Signal.createHigh(bitWidth);
            this.pinOut.setSignal(highSignal);
        }else {
            let lowSignal = Signal.createLow(bitWidth);
            this.pinOut.setSignal(lowSignal);
        }
    }
}

module.exports = Button;