const { SimpleLogicModule, Signal, PinDirection, ShortCircuitException } = require('jslogiccircuit');
const { Binary } = require('jsbinary');

/**
 * 并联器
 *
 * - 目前 Pin 只支持数据最宽 32 位
 * - 目前 Pin 只支持单线路输入，
 *   可以通过本模块（并联模块）来实现多条线路输入，并联模块
 *   会判断有无短路的情况，然后选择非高阻抗的输入信号作为输出信号。
 */
class Parallel extends SimpleLogicModule {

    // override
    init() {
        // 模块参数
        let inputPinCount = this.getParameter('inputPinCount'); // 输入端口的数量
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 输入端口的名称分别为 in_0, in_1, ... in_N
        for (let idx = 0; idx < inputPinCount; idx++) {
            this.addPin('in_' + idx, bitWidth, PinDirection.input);
        }
    }

    // override
    updateModuleState() {
        let inputPins = this.getInputPins();
        let firstPin = inputPins[0];

        let vOut;
        let zOut;

        // 只考虑数据最宽 32 位的情况。

        let signalPrevious = firstPin.getSignal()
        let vPrevious = signalPrevious.getBinary().toInt32();
        let zPrevious = signalPrevious.getHighZ().toInt32();

        for (let idx = 1; idx < inputPins.length; idx++) {
            let signalNext = inputPins[idx].getSignal()
            let vNext = signalNext.getBinary().toInt32();
            let zNext = signalNext.getHighZ().toInt32();

            // 仅当双方都不是高阻抗，且值不同时，才会短路
            let bothValid = ~(zPrevious | zNext);
            let diffV = vPrevious ^ vNext;
            let conflict = bothValid & diffV;

            if (conflict !== 0) {
                throw new ShortCircuitException(undefined, [this]);
            }

            vOut = (vPrevious & ~zPrevious) | (vNext & ~zNext); // 将高阻抗当作低电平
            zOut = zPrevious & zNext; // 两者都为高阻抗时结果才高阻抗

            vPrevious = vOut;
            zPrevious = zOut
        }

        let bitWidth = this.pinOut.bitWidth;
        let signalResult = Signal.create(bitWidth,
            Binary.fromInt32(vOut, bitWidth),
            Binary.fromInt32(zOut, bitWidth));

        this.pinOut.setSignal(signalResult);
    }
}


module.exports = Parallel;