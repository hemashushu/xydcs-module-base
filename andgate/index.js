const AbstractBaseLogicModule = require('../abstractbaselogicmodule');
const {Binary} = require('jsbinary');

/**
 * 逻辑与门
 */
class AndGate extends AbstractBaseLogicModule {

    constructor(name, parameters) {
        super(name, parameters);

        // 模块参数
        let inputWireCount = parameters.inputWireCount; // 输入线的数量
        let bitWidth = parameters.bitWidth; // 数据宽度

        let outputWire = this.addOutputWire('out', bitWidth);

        // 输入线的名称分别为 in0, in1, ... inN
        let createInputWire = (idx) => {
            let inputWire = this.addInputWire('in' + idx, bitWidth);

            inputWire.addListener(() => {
                let outputData = this.inputWires[0].data;
                for(let idx=1; idx<this.inputWires.length; idx++) {
                    outputData = Binary.and(outputData, this.inputWires[idx].data);
                }

                if (!Binary.equals(outputData, outputWire.data)) {
                    outputWire.setData(outputData);
                }
            });
        };

        // 输入线们
        for (let idx = 0; idx < inputWireCount; idx++) {
            createInputWire(idx);
        }
    }

    getModuleClassName() {
        return 'andgate'; // 同目录名
    }
}


module.exports = AndGate;