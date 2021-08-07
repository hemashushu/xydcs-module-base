const fsPromise = require('fs/promises');
const path = require('path');

const { PackageRepositoryManager, LogicPackageLoader, LogicModuleLoader } = require('jslogiccircuit');
const { ModuleUnitTestController } = require('jslogiccircuitunittest');

/**
 * 测试指定模块的所有单元测试脚本。
 *
 * @param {*} packageName
 * @param {*} moduleClassName
 * @returns true/false，当模块的所有单元测试脚本都通过时返回 true，
 *     否则返回 false。
 */
async function testModule(packageName, moduleClassName) {
    console.log(`Testing module "${moduleClassName}"...`);

    let pass = true;
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
            pass = false;
            console.log(`\t⛔ ${unitTestResult.title}`);
            console.log(`\t   ${dataTestResult.exception.message}`);
            // TODO::
            // - 针对每一种错误类型进行解析
            // - 针对 ScriptParseException 类型对其中的 ParseErrorDetail 的每一种 code 进行解析
            console.log(dataTestResult.exception);

        } else {
            pass = false;
            console.log(`\t⛔ ${unitTestResult.title}`);
            console.log(`\t   ` +
                `Line: ${dataTestResult.lineIdx + 1}, ` +
                `port: "${dataTestResult.portName}", ` +
                `expect: 0b${dataTestResult.expect.toBinaryString()}, ` +
                `actual: 0b${dataTestResult.actual.toBinaryString()}`);
        }
    }

    console.log('');
    return pass;
}

/**
 * 测试指定逻辑包。
 *
 * @param {*} packageName
 * @returns true/false，当逻辑包的所有模块的所有单元测试脚本都
 *     通过时，返回 true，否则返回 false。
 */
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

    let pass = true;
    for (let logicModuleItem of allLogicModuleItems) {
        let modulePass = await testModule(packageName, logicModuleItem.moduleClassName);
        if (!modulePass) {
            pass = false;
        }
    }

    return pass;
}

async function test() {
    let packageDirectory = __dirname;
    let packageInfoFilePath = path.join(packageDirectory, 'package.json');
    let textContent = await fsPromise.readFile(packageInfoFilePath, 'utf-8');
    let packageInfo = JSON.parse(textContent);

    let pass = await testPackage(packageInfo.name);

    if (pass) {
        console.log('🎉🎈 All module test pass 🎈🎉');
    }
}

test();