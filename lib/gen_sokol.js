
function getVariableName(name) {
    return name.split('').map(char => char === char.toUpperCase() ? `_${char.toLowerCase()}` : char).join('');
}

function convertToStringLine(line) {
    return `  "${line}\\n"`;
}


function genGLSL(data) {

}

function generateShaderList(programs) {
    return [
        '/* Array of all shaders */',
        '',
        `const shd_shader shd_shaders[${programs.length}] = (shd_shader[${programs.length}]) {`,
        programs.map((program, index) => [
            ``,
            `  [${index}] = (shd_shader) {`,
            `    .name = "${program.name}",`,
            `    .create = &shd_make_shader_${getVariableName(program.name)}`,
            `    .uniformBlocks = (shd_uniform_block[SG_MAX_SHADERSTAGE_UBS]) {`,
            program.uniformBlocks.map((block, index) => {
                return [
                    `      [${index}] = (shd_uniform_block) {`,
                    `        .name = ${block.name},`,
                    `      }`,
                ];
            }),
            `    }`,
            `  }`,
            ``
        ].join('\n')).join('\n'),
        `}`
    ].join('\n');
}

function genSokol(data, languages, targetPath) {
    return [
        '#ifdef __cpp',
        'extern "C" {',
        '#endif',
        '/* Shaders */',
        '',
        shaders.map(shader => {
            if (shader.lang.startWith('glsl')) {
                return [
                    `const char* shd_shadersource_${getVariableName(shader.name)} =`,
                    `${shader.source.split('\n').map(convertToStringLine).join('\n')};`
                ].join('\n');
            }
        }),
        '',
        '',
        '/* Shaders */',
        '',
        programs.map(program => [
            `sg_shader shd_make_shader_${getVariableName(program.name)}() {`
            `  return sg_make_shader(&(sg_shader_desc){`,
            `    .vs.source = shd_shadersource_${getVariableName(program.vs)},`,
            `    .fs.source = shd_shadersource_${getVariableName(program.fs)},`,
            `  });`,
            `}`,
            ''
        ].join('\n')),
        '',
        '',
        '',
        '#ifdef __cpp',
        '} /* extern "C" */',
        '#endif',
    ].join('\n');
}

genSokol.default = genSokol;

module.exports = genSokol;