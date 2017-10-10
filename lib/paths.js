const os = require('os');
const osName = os.platform().replace('darwin', 'osx').replace('win32', 'win');
const shdcPath = `./bin/${osName}/shdc`;

module.exports.tempPath = './tmp/';
module.exports.binPath = `./bin/${osName}`;