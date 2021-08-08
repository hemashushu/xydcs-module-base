const { Signal, PinDirection, InteractiveLogicModule } = require('jslogiccircuit');

/**
 * 时钟
 *
 * 该时钟主要用于设置参数，信号的改变（即实际的产生）由模拟器程序所控制。
 *
 * 模拟器程序是一个重复地调用 ModuleStateController.update() 方法的程序，
 * 在某些情况下，比如到达用户设置的断点，会暂停该方法的调用。
 * 然后在用户恢复（resume）之后会再次调用上述的 update() 方法。
 *
 * 调用 update() 方法的策略有两种：
 * 1. 电路中无时钟模块，或者有时钟模块，但设定了固定的频率，此时只有在交互式
 *    模块改变了状态，以及时钟模块到达预设的时间时，才调用 update() 方法。
 * 2. 电路中有时钟模块，且时钟模块的频率设置为 -1 （即尽可能地快），此时模拟
 *    程序会忽略交互式模块的事件，然后持续不断地调用 update() 方法，直到遇到
 *    断点或者用户执行暂停或者停止操作时才暂停或者停止。
 */
class Clock extends InteractiveLogicModule {

    // override
    init() {
        // 时钟频率，单位 Hz
        this._frequency = this.getParameter('frequency');

        // 输出端口
        this._pinOut = this.addPin('out', bitWidth, PinDirection.output);

        // 常量信号
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