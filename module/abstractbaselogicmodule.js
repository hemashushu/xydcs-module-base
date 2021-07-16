const { NotImplementedException } = require('jsexception');
const { AbstractLogicModule } = require('jslogiccircuit');

class AbstractBaseLogicModule extends AbstractLogicModule {
    constructor(name, instanceParameters = {}, defaultParameters = {}) {
        super(name, instanceParameters, defaultParameters);
        this.init();
    }

    init() {
        throw new NotImplementedException();
    }

    getPackageName() {
        return 'yudce-module-base'; // 同 NPM 包名
    }
}

module.exports = AbstractBaseLogicModule;