const { NotImplementedException } = require('jsexception');
const { AbstractLogicModule } = require('jslogiccircuit');

class AbstractBaseLogicModule extends AbstractLogicModule {
    constructor(packageName, moduleClassName, name, instanceParameters = {}, defaultParameters = {}) {
        super(packageName, moduleClassName, name, instanceParameters, defaultParameters);
        this.init();
    }

    init() {
        throw new NotImplementedException();
    }
}

module.exports = AbstractBaseLogicModule;