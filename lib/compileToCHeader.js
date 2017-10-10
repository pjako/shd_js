const headerStart = `#ifdef __cpp`;
const headerEnd = `#endif`;
function createCHeader(compiled) {
    const vertexShadersLines = compiled.vertexShaders.map(vertexShader => {
        return `const char* shd_vs_${vertexShader.name.toLowerCase()} = "${vertexShader.source}";`;
    }).join('\n');
    const fragmentShadersLines = compiled.vertexShaders.map(fragmentShader => {
        return `const char* shd_fs_${fragmentShader.name.toLowerCase()} = "${fragmentShader.source}";`;
    }).join('\n');
    const programsLines = compiled.programs.map(program => {
        const vsName = `shd_vs_${program.vertexShader.toLowerCase()}`;
        const fsName = `shd_fs_${program.fragmentShader.toLowerCase()}`;
        return `const shd_program shd_program_${program.name.toLowerCase()} = (shd_program) { .vertexShader = ${vsName}, .fragmentShader = ${fsName} };`
    }).join('\n');
    return [
        headerStart,
        vertexShadersLines,
        '',
        vertexShadersLines,
        '',
        programsLines,
        headerEnd
    ].join('\n');
}