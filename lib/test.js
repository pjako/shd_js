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

function compileShader(type, shaders) {
    return (shaderName) => {
        const shader = shaders[shaderName];
        // glslangValidator decides by file extension what shader type is passed
        const filePath = ['./', shaderName, crypto.randomBytes(16).toString("hex"), type].join('.');
        const spirvFilePath = `${filePath}.spirv`;
        const source = [
            '#version 330',
            shader.getAnnotatedSource().map(line => line.content).join('\n')
        ].join('\n');
        return writeFile(filePath, source).then(() => glslToSpirv(filePath, spirvFilePath)).then((compiled) => {
            fs.unlinkSync(filePath);
            return {
                shaderName,
                shader,
                spirvPath: spirvFilePath,
                errors: compiled.errors
            };
        });
    }
}

getFile('./test/simple.glsl').then(fileContent => {
    const compiledShd = shdParser([fileContent], (path) => {});
    const vsShaders = new Set();
    const fsShaders = new Set();
    Object.keys(compiledShd.programs).forEach(programName => {
        const program = compiledShd.programs[programName];
        vsShaders.add(program.vs);
        fsShaders.add(program.fs);
    });
    return Promise.all(
        Array.from(vsShaders).map(compileShader('vert', compiledShd.vertexShaders))
        .concat(Array.from(fsShaders).map(compileShader('frag', compiledShd.fragmentShaders)))
    ).then(shaders => Promise.all(shaders.map(shader => {
        //console.log('simple.glsl', shader);
        const targetPath = shader.spirvPath.substring(0, shader.spirvPath.lastIndexOf('.spirv'));
        //console.log('simple.glsl2');
        return spirvCross(shader.spirvPath, targetPath, allLangTargets).then(paths => ({
            paths,
            name: shader.shaderName
        }));
    }))).then(shaders => ({
        programs: compiledShd.programs,
        shaders
    })).then(console.log);
});