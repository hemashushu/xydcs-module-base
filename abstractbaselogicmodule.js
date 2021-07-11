const { AbstractLogicModule } = require('jslogiccircuit');

class AbstractBaseLogicModule extends AbstractLogicModule {
    getPackageName() {
        return 'yudce-module-base'; // 同 NPM 包名
    }
}

module.exports = AbstractBaseLogicModule;