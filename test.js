const path = require('path');

const { PackageRepositoryManager, LogicPackageLoader, LogicModuleLoader } = require('jslogiccircuit');
const { ModuleUnitTestController } = require('jslogiccircuitunittest');

async function testModule(packageName, moduleClassName) {
    console.log(`Testing module "${moduleClassName}"...`);

    let moduleUnitTestResult = await ModuleUnitTestController.testModule(
        packageName, moduleClassName);

    let unitTestResults = moduleUnitTestResult.unitTestResults;
    for (let unitTestResult of unitTestResults) {
        let testResult = unitTestResult.testResult;
        if (testResult.pass) {
            console.log(`\t✅ ${unitTestResult.title}`);
        } else {
            console.log(`\t⛔ ${unitTestResult.title}`);
            console.log(`\t   ` +
                `Line: ${testResult.lineIdx + 1}, ` +
                `port: "${testResult.portName}", ` +
                `expect: 0b${testResult.expect.toBinaryString()}, ` +
                `actual: 0b${testResult.actual.toBinaryString()}`);
        }
    }

    console.log('');
}

async function testPackage(packageName) {
    console.log(`Loading package "${packageName}"...`);

    let projectDirectory = __dirname;
    let packageDirectory = projectDirectory;
    let packageRepositoryDirectory = path.dirname(packageDirectory);

    let packageRepositoryManager = new PackageRepositoryManager()
    packageRepositoryManager.addRepositoryDirectory(packageRepositoryDirectory, false);

    await LogicPackageLoader.loadLogicPackage(
        packageRepositoryManager,
        packageName);

    console.log('');

    let logicModuleItems = LogicModuleLoader.getLogicModuleItemsByPackageName(packageName);
    for (let logicModuleItem of logicModuleItems) {
        await testModule(packageName, logicModuleItem.moduleClassName);
    }
}

testPackage('yudce-module-base');