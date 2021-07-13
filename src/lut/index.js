const { Binary } = require('jsbinary');
const { Signal } = require('jslogiccircuit');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class LookupTable extends AbstractBaseLogicModule {

    init() {
        // 模块参数
        let inputPinCount = this.getParameter('inputPinCount'); // 输入端口的数量
        let outputBitWidth = this.getParameter('outputBitWidth'); // 输出数据宽度
        let

        // 输出端口
        this.addOutputPinByDetail('out', outputBitWidth);

        // 输入端口的名称分别为 in0, in1, ... inN
        let createInputPin = (idx) => {
            this.addInputPinByDetail('in' + idx, outputBitWidth);
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
    updateModuleStateAndOutputPinsSignal() {
//         let datas = this.inputPins.map(pin => {
//             return pin.getData();
//         });
//
//         let resultData = datas[0];
//         for (let idx = 1; idx < datas.length; idx++) {
//             resultData = Binary.and(resultData, datas[idx]);
//         }
//
//         this.outputPins[0].setSignal(resultData);
    }
}

module.exports = LookupTable;