const { Binary } = require('jsbinary');

const AbstractLogicModule = require('../abstractlogicmodule');

/**
 * 多路复用器
 *
 */
class Multiplexer extends AbstractLogicModule {
    /**
     *
     * @param {*} name 模块名称
     * @param {*} dataWidth 数据宽度
     * @param {*} controlWireDataWidth 控制信号的数据宽度，
     *     输入线的数量为 2^controlWireDataWidth，例如
     *     当控制线宽度为 2 时，输入线数量为 2^2=4，
     *     当控制线宽度为 4 时，输入线的数量为 2^4=8
     */
    constructor(name, dataWidth, controlWireDataWidth) {
        super(name, {
            dataWidth: dataWidth,
            controlWireDataWidth: controlWireDataWidth
        });

        let sourceWireCount = 2 ** controlWireDataWidth;
        let outputWire = this.addOutputWire('out', dataWidth);

        let buildInputWire = (idx) => {
            // 输入线的名称分别为 in0, in1, ... inN
            let inputWire = this.addInputWire('in' + idx, dataWidth);

            inputWire.addListener(data => {
                if (controlWire.data.value === idx) {
                    outputWire.setData(data);
                }
            });
        };

        for (let idx = 0; idx < sourceWireCount; idx++) {
            buildInputWire(idx);
        }

        // 控制线
        let controlWire = this.addInputWire('control', controlWireDataWidth);

        // 当控制信号改变时，重新传递相应源数据到输出线。
        controlWire.addListener(data => {
            let inputWireIdx = data.value;
            let inputWire = this.inputWires[inputWireIdx];

            let outputData = inputWire.data;
            outputWire.setData(outputData);
        });
    }
}

Multiplexer.className = 'multiplexer';

module.exports = Multiplexer;