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
        // 模块参数
        this.frequency = this.getParameter('frequency'); // 频率，单位 Hz

        // 输出端口
        this.pinOut = this.addPin('out', bitWidth, PinDirection.output);

        this.lowSignal = Signal.createLow(1);
        this.highSignal = Signal.createHigh(1);
    }

    getFrequency() {
        return this.frequency;
    }

    setState(isHigh) {
        this._isHigh = isHigh;
        this.setInputSignalChangedFlag();
        this.dispatchActiveEvent();
    }

    // override
    updateModuleState() {
        if (this._isHigh){
            this.pinOut.setSignal(this.highSignal);
        }else {
            this.pinOut.setSignal(this.lowSignal);
        }
    }
}

module.exports = Clock;