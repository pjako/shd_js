const { binPath } = require('./paths');
const { exec } = require('child_process');
const glslangValidatorOutputParser = require('./glslangValidatorOutputParser');
function glslToSpirv(sourcePath, targetPath) {
    return new Promise(resolve => {
        exec(`${binPath}/glslangValidator -G -o ${targetPath} ${sourcePath}`, (error, stdout) => {
            resolve({
                errors: error ? glslangValidatorOutputParser(stdout) : [],
                targetPath
            });
        });
    });
}
module.exports = glslToSpirv;
module.exports.glslToSpirv = glslToSpirv;
module.exports.default = glslToSpirv;