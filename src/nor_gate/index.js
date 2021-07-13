const { Binary } = require('jsbinary');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class NorGate extends AbstractBaseLogicModule {

    init() {
        // 模块参数
        let inputPinCount = this.getParameter('inputPinCount'); // 输入端口的数量
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.addOutputPinByDetail('out', bitWidth);

        // 输入端口的名称分别为 in0, in1, ... inN
        let createInputPin = (idx) => {
            this.addInputPinByDetail('in' + idx, bitWidth);
        };

        // 输入端口
        for (let idx = 0; idx < inputPinCount; idx++) {
            createInputPin(idx);
        }
    }

    getModuleClassName() {
        return 'nor_gate'; // 同目录名
    }

    // override
    updateModuleDataAndOutputPinsData() {
        let datas = this.inputPins.map(pin => {
            return pin.getData();
        });

        let resultData = datas[0];
        for (let idx = 1; idx < datas.length; idx++) {
            resultData = Binary.or(resultData, datas[idx]);
        }

        resultData = Binary.not(resultData);
        this.outputPins[0].setData(resultData);
    }
}

module.exports = NorGate;