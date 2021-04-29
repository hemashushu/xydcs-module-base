const {AbstractLogicModule} = require('jslogiccircuit');

class AbstractBaseLogicModule extends AbstractLogicModule {
    constructor(name, parameters) {
        super(name, parameters);
    }

    getPackageName() {
        return 'ycemu-module-base'; // 同 NPM 包名
    }
}

module.exports = AbstractBaseLogicModule;