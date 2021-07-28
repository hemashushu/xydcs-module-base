const { Binary } = require('jsbinary');
const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * 非门
 */
class NotGate extends SimpleLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 输出端口
        this._pinOut = this.addPin('out', this._bitWidth, PinDirection.output);

        // 输入端口
        this._pinIn = this.addPin('in', this._bitWidth, PinDirection.input);
    }

    // override
    updateModuleState() {
        let state = this._pinIn.getSignal().getState();
        let levelResult = Binary.and(state.level, Binary.not(state.highZ));
        levelResult = Binary.not(levelResult);

        let signalResult = Signal.createWithoutHighZ(this._bitWidth, levelResult);
        this._pinOut.setSignal(signalResult);
    }
}

module.exports = NotGate;