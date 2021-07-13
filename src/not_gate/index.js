const { Binary } = require('jsbinary');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class NotGate extends AbstractBaseLogicModule {

    init() {
        // 模块参数
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.addOutputPinByDetail('out', bitWidth);

        // 输入端口
        this.addInputPinByDetail('in', bitWidth);
    }

    getModuleClassName() {
        return 'not_gate'; // 同目录名
    }

    // override
    updateModuleDataAndOutputPinsData() {
        let resultData = Binary.not(this.inputPins[0].getData());
        this.outputPins[0].setData(resultData);
    }
}

module.exports = NotGate;