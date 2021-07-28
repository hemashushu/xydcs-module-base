const { PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * LED
 *
 */
class LED extends SimpleLogicModule {

    // override
    init() {
        // 颜色
        // 一个字符串，示例：
        // '#ff0000'
        this._color = this.getParameter('color');

        // 输入端口
        this._pinIn = this.addPin('in', bitWidth, PinDirection.input);
    }

    // override
    updateModuleState() {
        let signal = this._pinIn.getSignal();
        // TODO::
    }
}

module.exports = LED;