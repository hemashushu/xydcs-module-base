const { Binary } = require('jsbinary');
const { Signal, PinDirection, SimpleLogicModule } = require('jslogiccircuit');

/**
 * LED
 *
 * 可以通过设置 bitWidth 大于 1 以实现 LED 阵列。
 */
class LED extends SimpleLogicModule {

    // override
    init() {
        // 数据宽度
        this._bitWidth = this.getParameter('bitWidth');

        // 颜色
        // 一个字符串数组，示例：
        // ['#ff0000', '#00ff00']
        this._colors = this.getParameter('colors');

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