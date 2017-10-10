const { binPath } = require('./paths');
const { exec } = require('child_process');
const glslangValidatorOutputParser = require('./glslangValidatorOutputParser');

function spirvCross(sourcePath, targetPath, langTargets) {
    return Promise.all(langTargets.map(lang => new Promise(resolve => {
        exec(`${binPath}/shdc -o ${targetPath}.${lang} -spirv ${sourcePath} -lang ${lang}`, (error, stdout) => {
            resolve({
                shaderPaths: langTargets.map(path => ({
                    lang,
                    source: `${targetPath}.${lang}`,
                    metadata: `${targetPath}.${lang}.json`
                }))
            });
        });
    })));
}
module.exports = spirvCross;
module.exports.spirvCross = spirvCross;
module.exports.default = spirvCross;