const AbstractLogicModule = require('../abstractlogicmodule');

/**
 * 逻辑或门
 */
class OrGate extends AbstractLogicModule {

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

        let createInputWire = (idx) => {
            let inputWire = this.addInputWire('in' + idx, 1);

            inputWire.addListener(() => {
                let result = 0
                for(let inputUnit of this.inputWires) {
                    if (inputUnit.data.getBit(0) === 1) {
                        result = 1;
                        break;
                    }
                }

                let outputData = outputWire.data;
                outputData.setBit(0, result);
                outputWire.setData(outputData);
            });
        };

        // 输入线们
        for (let idx = 0; idx < inputWireCount; idx++) {
            createInputWire(idx);
        }
    }
}

OrGate.className = 'orGate';

module.exports = OrGate;