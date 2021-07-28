const { Signal, PinDirection, InteractiveLogicModule } = require('jslogiccircuit');

/**
 * 时钟
 *
 * 该时钟主要用于设置允许参数，信号的改变（即实际的产生）由模拟器程序所控制。
 *
 */
class Clock extends InteractiveLogicModule {

    // override
    init() {
        // 时钟频率，单位 Hz
        this._frequency = this.getParameter('frequency');

        // 输出端口
        this._pinOut = this.addPin('out', bitWidth, PinDirection.output);

        this._signalLow = Signal.createLow(1);
        this._signalHigh = Signal.createHigh(1);
    }

    getFrequency() {
        return this._frequency;
    }

    setState(isHigh) {
        this._isHigh = isHigh;
        this.setInputSignalChangedFlag();
        this.dispatchActiveEvent();
    }

    // override
    updateModuleState() {
        if (this._isHigh) {
            this._pinOut.setSignal(this._signalHigh);
        } else {
            this._pinOut.setSignal(this._signalLow);
        }
    }
}

module.exports = Clock;