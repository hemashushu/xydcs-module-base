const { SimpleLogicModule, PinDirection } = require('jslogiccircuit');

/**
 * 线路并联扩展器。
 *
 * 将一条线路并联地扩展为多条线路。每一条输出线路的信号都跟输入信号相同。
 * 实际上每一个输出引脚（Pin）本身就支持连接到多个输入引脚，这个逻辑模块更多是为了
 * 布线（布局）的需要而存在。
 *
 * 目前 Pin 只支持数据最宽 32 位。
 *
 */
class ParallelExpand extends SimpleLogicModule {

    // override
    init() {
        // 输入端口的数量
        this._outputPinCount = this.getParameter('outputPinCount');

        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 输入端口
        this._pinIn = this.addPin('in', this._bitWidth, PinDirection.input);

        // 输出端口的名称分别为 out_0, out_1, ... out_N
        for (let idx = 0; idx < this._outputPinCount; idx++) {
            this.addPin('out_' + idx, this._bitWidth, PinDirection.output);
        }
    }

    // override
    updateModuleState() {
        let signal = this._pinIn.getSignal();
        for (let idx = 0; idx < this._outputPinCount; idx++) {
            this.outputPins[idx].setSignal(signal);
        }
    }
}


module.exports = ParallelExpand;