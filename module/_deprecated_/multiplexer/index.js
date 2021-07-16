const AbstractBaseLogicModule = require('../abstractbaselogicmodule');
const {Binary} = require('jsbinary');

/**
 * 多路复用器
 *
 */
class Multiplexer extends AbstractBaseLogicModule {

    constructor(name, parameters){
        super(name, parameters);

        // 模块参数
        let bitWidth = parameters.bitWidth; // 数据宽度
        let controlWireBitWidth = parameters.controlWireBitWidth; // 控制信号的数据宽度

        // controlWireBitWidth:
        //
        // 输入线的数量为 2^controlWireDataWidth，例如
        // 当控制线宽度为 2 时，输入线数量为 2^2=4，
        // 当控制线宽度为 4 时，输入线的数量为 2^4=8

        let sourceWireCount = 2 ** controlWireBitWidth;
        let outputWire = this.addOutputWire('out', bitWidth);

        let buildInputWire = (idx) => {
            // 输入线的名称分别为 in0, in1, ... inN
            let inputWire = this.addInputWire('in' + idx, bitWidth);

            inputWire.addListener(data => {
                if (controlWire.data.value === idx &&
                    !Binary.equals(data, outputWire.data)) {
                    outputWire.setData(data);
                }
            });
        };

        for (let idx = 0; idx < sourceWireCount; idx++) {
            buildInputWire(idx);
        }

        // 控制线
        let controlWire = this.addInputWire('control', controlWireBitWidth);

        // 当控制信号改变时，重新传递相应源数据到输出线。
        controlWire.addListener(data => {
            let inputWireIdx = data.value;
            let inputWire = this.inputWires[inputWireIdx];

            let outputData = inputWire.data;
            if (!Binary.equals(outputData, outputWire.data)){
                outputWire.setData(outputData);
            }
        });
    }

    getModuleClassName() {
        return 'multiplexer'; // 同目录名
    }
}

module.exports = Multiplexer;