const AbstractBaseLogicModule = require('../abstractbaselogicmodule');
const {Binary} = require('jsbinary');

/**
 * 连接线适配器
 *
 * 只连接上一个连接线部分（宽度）数据。
 * 即 wire [targetBitWidth - 1:0] target = source[targetBitWidth + bitOffset - 1:bitOffset]
 */
class Adapter extends AbstractBaseLogicModule {

    constructor(name, parameters) {
        super(name, parameters);

        // 模块参数
        let bitWidth = parameters.bitWidth; // 输出数据的宽度
        let sourceBitWidth = parameters.sourceBitWidth; // 源数据宽度
        let sourceBitOffset = parameters.sourceBitOffset; // 源数据偏移值

        let outputWire = this.addOutputWire('out', bitWidth);

        let inputWire = this.addInputWire('in', sourceBitWidth);

        inputWire.addListener(data => {
            let partialData = data.getBits(sourceBitOffset, bitWidth);
            if (!Binary.equals(partialData, outputWire.data)) {
                outputWire.setData(partialData);
            }
        });
    }
}

module.exports = Adapter;