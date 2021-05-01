const AbstractBaseLogicModule = require('../abstractbaselogicmodule');
const {Binary} = require('jsbinary');

/**
 * 逻辑或门
 */
class OrGate extends AbstractBaseLogicModule {

    /**
     *
     * @param {*} name
     * @param {*}
     */
    constructor(name, parameters) {
        super(name, parameters);

        // 模块参数
        let bitWidth = parameters.bitWidth; // 数据宽度
        let inputWireCount = this.parameters.inputWireCount; // 输入线的数量

        let outputWire = this.addOutputWire('out', bitWidth);

        let createInputWire = (idx) => {
            let inputWire = this.addInputWire('in' + idx, bitWidth);

            inputWire.addListener(() => {
                let outputData = this.inputWires[0].data;
                for(let idx=1; idx<this.inputWires.length; idx++) {
                    outputData = Binary.or(outputData, this.inputWires[idx].data);
                }

                if (!Binary.equals(outputData, outputWire.data)){
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
        return 'orgate'; // 同目录名
    }
}

module.exports = OrGate;