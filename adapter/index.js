const AbstractLogicModule = require('../abstractlogicmodule');

/**
 * 连接线适配器
 *
 * 只连接上一个连接线部分（宽度）数据。
 * 即 wire [targetDataWidth - 1:0] target = source[targetDataWidth + dataOffset - 1:dataOffset]
 */
class Adapter extends AbstractLogicModule {

    /**
     *
     * @param {*} name 模块名称
     * @param {*} dataWidth 输出数据的宽度
     * @param {*} sourceDataWidth 源数据宽度
     * @param {*} sourceDataOffset 源数据偏移值
     */
    constructor(name, dataWidth, sourceDataWidth, sourceDataOffset) {
        super(name, {
            dataWidth: dataWidth,
            sourceDataWidth: sourceDataWidth,
            sourceDataOffset: sourceDataOffset
        });

        let outputWire = this.addOutputWire('out', dataWidth);
        let inputWire = this.addInputWire('in', sourceDataWidth);

        inputWire.addListener(data => {
            let partialData = data.getBits(sourceDataOffset, dataWidth);
            outputWire.setData(partialData);
        });
    }
}

Adapter.className = 'adapter'

module.exports = Adapter;