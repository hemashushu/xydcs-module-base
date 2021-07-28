const { Binary } = require('jsbinary');
const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 查找表
 * 根据输入的地址输出预设好的值。
 */
class LookupTable extends SimpleLogicModule {

    // override
    init() {
        // 输入端口的数量
        this._inputPinCount = this.getParameter('inputPinCount');

        // 输出数据宽度
        this._outputBitWidth = this.getParameter('outputBitWidth');

        // dataTable 的结构为：
        // [{address: Number, value: Number},...]
        let dataTable = this.getParameter('dataTable');

        // 将 dataTable 映射到一数组，数组大小为 2^inputPinCount
        // | address | value |
        // |---------|-------|
        // |    0000 |     0 |
        // |     ... |     . |
        // |    1111 |     0 |

        let signalRows = new Array(Math.pow(2, this._inputPinCount));

        for (let dataTableRow of dataTable) {
            let address = Number(dataTableRow.address);
            let value = Number(dataTableRow.value);

            let binary = Binary.fromInt32(value, this._outputBitWidth);
            let signal = Signal.createWithoutHighZ(this._outputBitWidth, binary);
            signalRows[address] = signal;
        }

        // 信号列表
        this._signalRows = signalRows;

        // 输出端口
        this._pinOut = this.addPin('out', this._outputBitWidth, PinDirection.output);

        // 输入端口的名称分别为 in_0, in_1, ... in_N
        for (let idx = 0; idx < this._inputPinCount; idx++) {
            this.addPin('in_' + idx, 1, PinDirection.input);
        }
    }

    // override
    updateModuleState() {
        let address = 0;
        for (let idx = 0; idx < this.inputPins.length; idx++) {
            let inputPin = this.inputPins[idx];
            let levelInt32 = inputPin.getSignal().getLevel().toInt32(); // 0 or 1
            address += Math.pow(2, idx) * levelInt32;
        }

        let resultSignal = this._signalRows[address];
        this._pinOut.setSignal(resultSignal);
    }
}

module.exports = LookupTable;