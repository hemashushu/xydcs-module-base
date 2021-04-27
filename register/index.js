const {Binary} = require('jsbinary');

const {AbstractLogicModule} = require('jslogiccircuit');

/**
 * 寄存器
 *
 * 用于寄存一个数值，相当于 Verilog 里的 reg 变量。
 *
 * 比如 `reg [7:0] rs` 可以使用如下语句构造：
 * let rs = new Wire('rs', 8)
 */
class Register extends AbstractLogicModule {

    constructor(name, dataWidth) {
        super(name, {
            dataWidth: dataWidth
        });

        // 用于临时存放上一个连接线传递过来的数值，当
        // 时钟信号到来时，再把临时数值更新到当前连接线。
        this.tempData = new Binary(0, dataWidth);

        this.addOutputWire('out', dataWidth);

        let inputWire = this.addInputWire('in', dataWidth);

        inputWire.addListener(data => {
            this.tempData.update(data);
        });
    }

    /**
     * 时钟触发信号到来。
     */
    pulse() {
        let outputWire = this.outputWires[0];
        outputWire.setData(this.tempData);
    }
}

Register.className = 'register';

module.exports = Register;