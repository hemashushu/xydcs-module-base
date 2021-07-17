const { Binary } = require('jsbinary');
const { Signal, PinDirection } = require('jslogiccircuit');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class LookupTable extends AbstractBaseLogicModule {

    init() {
        // 模块参数
        let inputPinCount = this.getParameter('inputPinCount'); // 输入端口的数量
        let outputBitWidth = this.getParameter('outputBitWidth'); // 输出数据宽度

        // dataTable 的结构为：
        // [{address: Number, value: Number},...]
        let dataTable = this.getParameter('dataTable');

        // 将 dataTable 映射到一数组，数组大小为 2^inputPinCount
        // | address | value |
        // |---------|-------|
        // |    0000 |     0 |
        // |     ... |     . |
        // |    1111 |     0 |

        let rows = new Array(Math.pow(2, inputPinCount));

        for (let dataRow of dataTable) {
            let address = Number(dataRow.address);
            let value = Number(dataRow.value);
            let binary = Binary.fromInt32(value, outputBitWidth);
            let signal = Signal.createWithoutHighZ(outputBitWidth, binary);
            rows[address] = signal;
        }

        this.rows = rows;

        // 输出端口
        this.pinOut = this.addPin('out', outputBitWidth, PinDirection.output);

        // 输入端口的名称分别为 in0, in1, ... inN
        let createInputPin = (idx) => {
            this.addPin('in' + idx, outputBitWidth, PinDirection.input);
        };

        // 输入端口
        for (let idx = 0; idx < inputPinCount; idx++) {
            createInputPin(idx);
        }
    }

    getModuleClassName() {
        return 'lut'; // 同目录名
    }

    // override
    updateModuleState() {

        let address = 0;
        for (let idx = 0; idx < this.inputPins.length; idx++) {
            let inputPin = this.inputPins[idx];
            let bitValue = inputPin.getSignal().getBinary().toInt32();
            address += Math.pow(2, idx) * bitValue;
        }

        let resultSignal = this.rows[address];
        this.pinOut.setSignal(resultSignal);
    }
}

module.exports = LookupTable;