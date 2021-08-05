const path = require('path');

const { PackageRepositoryManager, LogicPackageLoader, LogicModuleLoader } = require('jslogiccircuit');
const { ModuleUnitTestController } = require('jslogiccircuitunittest');

async function testModule(packageName, moduleClassName) {
    console.log(`Testing module "${moduleClassName}"...`);

    let moduleUnitTestResult;

    try {
        moduleUnitTestResult = await ModuleUnitTestController.testModule(
            packageName, moduleClassName);

    } catch (err) {
        console.log('failed to run unit test, error: ' + err.message);
        console.log(err);
        console.log('');
        return;
    }

    let unitTestResults = moduleUnitTestResult.unitTestResults;
    for (let unitTestResult of unitTestResults) {
        let dataTestResult = unitTestResult.dataTestResult;
        if (dataTestResult.pass) {
            console.log(`\t✅ ${unitTestResult.title}`);
        } else if (dataTestResult.exception) {
            console.log(`\t⛔ ${unitTestResult.title}`);
            console.log(`\t   ${dataTestResult.exception.message}`);
            // TODO::
            // - 针对每一种错误类型进行解析
            // - 针对 ScriptParseException 类型对其中的 ParseErrorDetail 的每一种 code 进行解析
            console.log(dataTestResult.exception);
        } else {
            console.log(`\t⛔ ${unitTestResult.title}`);
            console.log(`\t   ` +
                `Line: ${dataTestResult.lineIdx + 1}, ` +
                `port: "${dataTestResult.portName}", ` +
                `expect: 0b${dataTestResult.expect.toBinaryString()}, ` +
                `actual: 0b${dataTestResult.actual.toBinaryString()}`);
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

    let allLogicModuleItems = [];

    let logicModuleItems = LogicModuleLoader.getLogicModuleItemsByPackageName(packageName, false);
    if (logicModuleItems !== undefined) {
        allLogicModuleItems.push(...logicModuleItems);
    }

    let simulationLogicModuleItems = LogicModuleLoader.getLogicModuleItemsByPackageName(packageName, true);
    if (simulationLogicModuleItems !== undefined) {
        allLogicModuleItems.push(...simulationLogicModuleItems);
    }

    if (allLogicModuleItems.length === 0) {
        console.log('No logic module');
        return;
    }

    for (let logicModuleItem of allLogicModuleItems) {
        await testModule(packageName, logicModuleItem.moduleClassName);
    }
}

testPackage('yudce-module-base');