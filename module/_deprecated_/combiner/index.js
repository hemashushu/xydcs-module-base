const AbstractBaseLogicModule = require('../abstractbaselogicmodule');
const {Binary} = require('jsbinary');

/**
 * 连接线组合器
 *
 * 用于拼接多个连接线的输入，形成一个单一输出线。
 * 比如将 "wire [3:0] a" 和 "wire [11:0] b" 组成
 * "assign wire [15:0] c = {a, b}"
 *
 * 实现如下：
 *
 * let a = new Wire('a', 4);
 * let b = new Wire('b', 12);
 *
 * let c = new Combiner('c', [4, 12])
 * connects([a,b], c.inputWires)
 *
 */
class Combiner extends AbstractBaseLogicModule {

    constructor(name, parameters) {
        super(name, parameters);

        // 模块参数
        let sourceBitWidths = parameters.sourceBitWidths;

        // sourceBitWidths:
        //
        // 各个源数据的宽度之集合，比如
        // [2,3,4] 表示有 3 路输入，各线路的数据宽度分别是 2，3，4。
        // 它们将会合并为一个宽度为 9 的输出线。
        // 相当于 Verilog 的 assign wire [8:0] out = {in0, in1, in2};
        // 第 1 条输入线的数据会被合并到输出线的最高位，最后一条输入线的数据
        // 会被合并到输出线的最低位。比如 in1 = 0b11, in2 = 0b000, in3 = 0b1010，
        // 会被合并为 0b110001010

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
        let bitWidth = sourceBitWidths.reduce((accumulator, currentValue) => accumulator + currentValue);
        let outputWire = this.addOutputWire('out', bitWidth);

        // 输入线的名称分别为 in0, in1, ... inN
        let createInputWire = (idx, targetBitOffset) => {
            let sourceBitWidth = sourceBitWidths[idx];
            let inputWire = this.addInputWire('in' + idx, sourceBitWidth);

            inputWire.addListener(data => {
                let outputData = outputWire.data.clone(); // 克隆一份
                outputData.setBits(data, targetBitOffset);

                if (!Binary.equals(outputData, outputWire.data)){
                    outputWire.setData(outputData);
                }
            });
        };

        let targetBitWidths = 0;
        for (let idx = 0; idx < sourceBitWidths.length; idx++) {
            targetBitWidths += sourceBitWidths[idx]; // 增加数据偏移值
            let targetBitOffset = bitWidth - targetBitWidths;
            createInputWire(idx, targetBitOffset);
        }
    }

    getModuleClassName() {
        return 'combiner'; // 同目录名
    }
}

module.exports = Combiner;