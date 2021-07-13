const path = require('path');

const { LogicPackageLoader } = require('jslogiccircuit');
const { ModuleUnitTestController } = require('jslogiccircuitunittest');

let projectDirectory = __dirname;
let packageDirectory = projectDirectory;
let packageName = path.basename(packageDirectory);
let packageRepositoryDirectory = path.dirname(packageDirectory);

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

async function testPackage() {
    console.log(`Loading package "${packageName}"...`);

    let packageItem = await LogicPackageLoader.loadLogicPackage(
        packageRepositoryDirectory,
        packageName);

    console.log('');

    let moduleClassNames = packageItem.modules;
    for (let moduleClassName of moduleClassNames) {
        await testModule(packageName, moduleClassName);
    }
}

testPackage();