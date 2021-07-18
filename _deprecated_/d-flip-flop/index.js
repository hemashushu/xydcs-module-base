const AbstractBaseLogicModule = require('../abstractbaselogicmodule');
const {Binary} = require('jsbinary');

/**
 * D类触发器
 *
 * 用于寄存一个数值，相当于 Verilog 里的 reg 变量。
 *
 * 比如 `reg [7:0] rs` 可以使用如下语句构造：
 * let rs = new Wire('rs', 8)
 */
class DFlipFlop extends AbstractBaseLogicModule {

    constructor(name, parameters) {
        super(name, parameters);

        // 模块参数
        let bitWidth = parameters.bitWidth; // 数据宽度

        // 用于临时存放上一个连接线传递过来的数值，当
        // 时钟信号由 0->1 时（即上升沿），再把临时数值更新到当前连接线。
        let tempData = new Binary(0, bitWidth);

        let outputWire = this.addOutputWire('Q', bitWidth);

        let inputWire = this.addInputWire('D', bitWidth);
        inputWire.addListener(data => {
            tempData.update(data);
        });

        let lastClockValue = 0;
        let clockWire = this.addInputWire('clock', 1);
        clockWire.addListener(data => {
            let posedge = (lastClockValue === 0 && data.value === 1);
            lastClockValue = data.value;

            if (posedge) {
                // 时钟信号上升沿
                if (!Binary.equals(tempData, outputWire.data)) {
                    outputWire.setData(tempData);
                }
            }
        });
    }
}

module.exports = DFlipFlop;