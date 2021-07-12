const AbstractBaseLogicModule = require('../abstractbaselogicmodule');
const {Binary} = require('jsbinary');

/**
 * 逻辑非门
 */
class NotGate extends AbstractBaseLogicModule {

    constructor(name, parameters) {
        super(name, parameters);

        // 模块参数
        let bitWidth = parameters.bitWidth; // 数据宽度

        let outputWire = this.addOutputWire('out', bitWidth);
        let inputWire = this.addInputWire('in', bitWidth);

        inputWire.addListener(data => {
            let outputData = Binary.not(data);
            if (!Binary.equals(outputData, outputWire.data)) {
                outputWire.setData(outputData);
            }
        });
    }

    getModuleClassName() {
        return 'notgate'; // 同目录名
    }
}

module.exports = NotGate;