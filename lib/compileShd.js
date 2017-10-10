const crypto = require("crypto");
const fs = require("fs");
const shdParser = require('./parser');
const glslToSpirv = require('./glslToSpirv');
const spirvCross = require('./spirvCross');

const allLangTargets = ['glsl100', 'glsles3', 'glsl120', 'glsl330', 'metal', 'hlsl'];

function getFile(path) {
    return new Promise(resolve => {
        fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                return console.error(err);
            }
            resolve(data);
        });
    });
}
function writeFile(path, content) {
    return new Promise(resolve => {
        fs.writeFile(path, content, { encoding: 'utf8' },  err => {
            if (err) {
                return console.error(err);
            }
            resolve(path);
        }); 
    });
}

function compileShd(shdSourcePath, langTargets = allLangTargets) {
    return getFile(shdSourcePath).then(file => {
        const collection = shdParser([file], (path) => {});
        return Promise.all(collection.programs.map(program => {
            const fileName = [program.name, crypto.randomBytes(16).toString("hex")].join('.');
            return writeFile(fileName, SOMETHING!).then(filePath => glslToSpirv(filePath, filePath)).then(spirvFilePath => {
                return spirvCross(spirvFilePath, spirvFilePath, langTargets).then(compiled => {
                    
                });
            });
        }));
    });
}