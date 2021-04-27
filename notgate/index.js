const AbstractLogicModule = require('../abstractlogicmodule');

/**
 * 逻辑非门
 */
class NotGate extends AbstractLogicModule {

    /**
     *
     * @param {*} name 模块名称
     */
    constructor(name) {
        super(name);

        let outputWire = this.addOutputWire('out', 1);
        let inputWire = this.addInputWire('in', 1);

        inputWire.addListener(data => {
            let value = data.getBit(0);
            let result = value === 0 ? 1 : 0;

            let outputData = outputWire.data;
            outputData.setBit(0, result);
            outputWire.setData(outputData);
        });
    }
}

NotGate.className = 'notGate';

module.exports = NotGate;