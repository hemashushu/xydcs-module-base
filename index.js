const {LogicPackageLoader} = require('jslogiccircuit');

console.log('loading module base... ');
console.log(require.main.filename);
console.log(__dirname);
console.log(__filename);
// LogicPackageLoader.loadCurrentLogicPackage();

module.exports = {};