const {Binary} = require('jsbinary');

const AbstractLogicModule = require('../abstractlogicmodule');

/**
 * 逻辑与门
 */
class AndGate extends AbstractLogicModule {

    /**
     *
     * @param {*} name
     * @param {*} inputWireCount 输入线的数量
     */
    constructor(name, inputWireCount) {
        super(name, {
            inputWireCount: inputWireCount
        });

        let outputWire = this.addOutputWire('out', 1);

        // 输入线的名称分别为 in0, in1, ... inN
        let createInputWire = (idx) => {
            let inputWire = this.addInputWire('in' + idx, 1);

            inputWire.addListener(() => {
                let result = 1
                for(let inputWire of this.inputWires) {
                    if (inputWire.data.getBit(0) === 0) {
                        result = 0;
                        break;
                    }
                }

                let outputData = new Binary(result, 1);
                outputWire.setData(outputData);
            });
        };

        // 输入线们
        for (let idx = 0; idx < inputWireCount; idx++) {
            createInputWire(idx);
        }
    }
}

AndGate.className = 'andGate';

module.exports = AndGate;