const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');
const { Binary } = require('jsbinary');

/**
 * 合并器
 * 将多条线路捆绑成一条
 */
class Merge extends SimpleLogicModule {

    // override
    init() {
        // 模块参数

        // 每个输入引脚的位宽
        let inputPinBitWidths = this.getParameter('inputPinBitWidths');

        // 反转数组以得到正确的端口名称的序号
        // 在配置文件中，
        // 先出现的条目的端口序号越大（比如 in_7），越靠近高位端。
        // 后出现的条目的端口序号越小（即 in_0），越靠近低位端。
        //
        // 比如 :
        // - 5 # in_2
        // - 2 # in_1
        // - 1 # in_0
        //
        // 对应输入端口 in_2, in_1, in_0 （位宽分别为 5, 2, 1） 合并为
        // [7:3,2:1,0:0]
        inputPinBitWidths.reverse();

        let outputBitWidth = 0;

        // 输入端口的名称分别为 in_0, in_1, ... in_N
        for(let idx=0; idx<inputPinBitWidths.length; idx++) {
            let inputBitWidth = inputPinBitWidths[idx];
            outputBitWidth += inputBitWidth;
            this.addPin('in_' + idx, inputBitWidth, PinDirection.input);
        }

        this.pinOut = this.addPin('out', outputBitWidth, PinDirection.output);
    }

    // override
    updateModuleState() {
        let outputBitWidth = this.pinOut.bitWidth;
        let outputBinary = Binary.fromInt32(0, outputBitWidth);
        let outputHighZ = Binary.fromInt32(0, outputBitWidth);

        let inputPins = this.getInputPins();
        let offset = 0;

        for (let idx = 0; idx < inputPins.length; idx++) {
            let inputPin = inputPins[idx];
            let {binary, highZ} = inputPin.getSignal().getState();

            outputBinary = outputBinary.splice(offset, binary);
            outputHighZ = outputHighZ.splice(offset, highZ);

            offset += inputPin.bitWidth;
        }

        let outputSignal = Signal.create(outputBitWidth, outputBinary, outputHighZ);
        this.pinOut.setSignal(outputSignal);
    }
}

module.exports = Merge;