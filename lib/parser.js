const optimize = require('./glslOptimizer.js').optimize;

const isGLSL = {
    'glsl100': true,
    'glsl120': true,
    'glsl150': true,
    'hlsl5': false,
    'metal': false
};

const slVersions = ['glsl100', 'glsl120', 'glsl330', 'glsles3', 'hlsl5', 'metal'];
const glslOptimizerTarget = {
    'glsl100': 2, 
    'glsl120': 3,  
    'glsl330': 3,
    'glsles3': 3
}
const slSlangTypes = {
    'glsl100': 'ShaderLang::GLSL100',
    'glsl120': 'ShaderLang::GLSL120',
    'glsl330': 'ShaderLang::GLSL330',
    'glsles3': 'ShaderLang::GLSLES3',
    'hlsl5':   'ShaderLang::HLSL5',
    'metal':   'ShaderLang::Metal'
};
const isHLSL = {
    'glsl100': false,
    'glsl120': false,
    'glsl330': false,
    'glsles3': false,
    'hlsl5': true,
    'metal': false
};
const isMetal = {
    'glsl100': false,
    'glsl120': false,
    'glsl330': false,
    'glsles3': false,
    'hlsl5': false,
    'metal': true
};

const glslVersionNumber = {
    'glsl100': 100,
    'glsl120': 120,
    'glsl330': 330,
    'glsles3': 300,
    'hlsl5': false,
    'metal': false
};
const slMacros = {
    'glsl100': {
        'ORYOL_GLSL': '(1)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(0)',
        'ORYOL_GLSL_VERSION': '(100)',
        '_vertexid': '(0)',
        '_instanceid': '(0)',
        '_position': 'gl_Position',
        '_pointsize': 'gl_PointSize',
        '_color': 'gl_FragColor',
        '_color1': 'gl_FragColor',
        '_color2': 'gl_FragColor',
        '_color3': 'gl_FragColor',
        '_fragcoord': 'gl_FragCoord',
        '_const': 'const',
        '_func': '',
        'sampler3D': 'sampler2D',       // hack to hide invalid sampler types
        'sampler2DArray': 'sampler2D',  // hack to hide invalid sampler types
        'mul(m,v)': '(m*v)',
        'tex2D(s, t)': 'texture2D(s,t)',
        'tex3D(s, t)': 'vec4(0.0)',
        'tex2DArray(s, t)': 'vec4(0.0)',
        'texCUBE(s, t)': 'textureCube(s,t)',
        'tex2Dvs(s, t)': 'texture2D(s,t)',
        'tex3Dvs(s, t)': 'vec4(0.0)',
        'tex2DArrayvs(s, t)': 'vec4(0.0)',
    },
    'glsl120': {
        'ORYOL_GLSL': '(1)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(0)',
        'ORYOL_GLSL_VERSION': '(120)',
        '_vertexid': 'gl_VertexID',
        '_instanceid': 'gl_InstanceID',
        '_position': 'gl_Position',
        '_pointsize': 'gl_PointSize',
        '_color': 'gl_FragColor',
        '_color1': 'gl_FragColor',
        '_color2': 'gl_FragColor',
        '_color3': 'gl_FragColor',
        '_fragcoord': 'gl_FragCoord',
        '_const': 'const',
        '_func': '',
        'sampler3D': 'sampler2D',       // hack to hide invalid sampler types
        'sampler2DArray': 'sampler2D',  // hack to hide invalid sampler types
        'mul(m,v)': '(m*v)',
        'tex2D(s, t)': 'texture2D(s,t)',
        'tex3D(s, t)': 'vec4(0.0)',
        'tex2DArray(s, t)': 'vec4(0.0)',
        'texCUBE(s, t)': 'textureCube(s,t)',
        'tex2Dvs(s, t)': 'texture2D(s,t)',
        'tex3Dvs(s, t)': 'vec4(0.0)',
        'tex2DArrayvs(s, t)': 'vec4(0.0)',
    },
    'glsl330': {
        'ORYOL_GLSL': '(1)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(0)',
        'ORYOL_GLSL_VERSION': '(330)',
        '_vertexid': 'gl_VertexID',
        '_instanceid': 'gl_InstanceID',
        '_position': 'gl_Position',
        '_pointsize': 'gl_PointSize',
        '_color': '_FragColor',
        '_color1': '_FragColor1',
        '_color2': '_FragColor2',
        '_color3': '_FragColor3',
        '_fragcoord': 'gl_FragCoord',
        '_const': 'const',
        '_func': '',
        'mul(m,v)': '(m*v)',
        'tex2D(s, t)': 'texture(s,t)',
        'tex3D(s, t)': 'texture(s,t)',
        'tex2DArray(s, t)': 'texture(s,t)',
        'texCUBE(s, t)': 'texture(s,t)',
        'tex2Dvs(s, t)': 'texture(s,t)',
        'tex3Dvs(s, t)': 'texture(s,t)',
        'tex2DArrayvs(s, t)': 'texture(s,t)',
    },
    'glsles3': {
        'ORYOL_GLSL': '(1)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(0)',
        'ORYOL_GLSL_VERSION': '(300)',
        '_vertexid': 'gl_VertexID',
        '_instanceid': 'gl_InstanceID',
        '_position': 'gl_Position',
        '_pointsize': 'gl_PointSize',
        '_color': '_FragColor',
        '_color1': '_FragColor1',
        '_color2': '_FragColor2',
        '_color3': '_FragColor3',
        '_fragcoord': 'gl_FragCoord',
        '_const': 'const',
        '_func': '',
        'mul(m,v)': '(m*v)',
        'tex2D(s, t)': 'texture(s,t)',
        'tex3D(s, t)': 'texture(s,t)',
        'tex2DArray(s, t)': 'texture(s,t)',
        'texCUBE(s, t)': 'texture(s,t)',
        'tex2Dvs(s, t)': 'texture(s,t)',
        'tex3Dvs(s, t)': 'texture(s,t)',
        'tex2DArrayvs(s, t)': 'texture(s,t)',
    },
    'hlsl5': {
        'ORYOL_GLSL': '(0)',
        'ORYOL_HLSL': '(1)',
        'ORYOL_METALSL': '(0)',
        '_vertexid': '_iVertexID',
        '_instanceid': '_iInstanceID',
        '_position': '_oPosition',
        '_pointsize': '_oPointSize',
        '_color': '_oColor',
        '_const': 'static const',
        '_func': '',
        'vec2': 'float2',
        'vec3': 'float3',
        'vec4': 'float4',
        'mat2': 'float2x2',
        'mat3': 'float3x3',
        'mat4': 'float4x4',
        'tex2D(_obj, _t)': '_obj.t.Sample(_obj.s,_t)',
        'texCUBE(_obj, _t)': '_obj.t.Sample(_obj.s,_t)',
        'tex2Dvs(_obj, _t)': '_obj.t.SampleLevel(_obj.s,_t,0.0)',
        'mix(a,b,c)': 'lerp(a,b,c)',
        'mod(x,y)': '(x-y*floor(x/y))',
        'fract(x)': 'frac(x)'
    },
    'metal': {
        'ORYOL_GLSL': '(0)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(1)',
        '_vertexid': 'vs_vertexid',
        '_instanceid': 'vs_instanceid',
        '_position': 'vs_out._vofi_position',
        '_pointsize': 'vs_out._vofi_pointsize',
        '_color': '_fo_color',
        '_color0': '_fo_color0',
        '_color1': '_fo_color1',
        '_color2': '_fo_color2',
        '_color3': '_fo_color3',
        '_const': 'constant',
        '_func': 'static',
        'bool': 'int',
        'vec2': 'float2',
        'vec3': 'float3',
        'vec4': 'float4',
        'mat2': 'float2x2',
        'mat3': 'float3x3',
        'mat4': 'float4x4',
        'mul(m,v)': '(m*v)',
        'mod(x,y)': '(x-y*floor(x/y))',
        'tex2D(_obj, _t)': '_obj.t.sample(_obj.s,_t)',
        'tex2DArray(_obj, _t)': '_obj.t.sample(_obj.s,_t)',
        'texCUBE(_obj, _t)': '_obj.t.sample(_obj.s,_t)',
        'tex3D(_obj, _t)': '_obj.t.sample(_obj.s,_t)',
        'tex2Dvs(_obj, _t)': '_obj.t.sample(_obj.s,_t,level(0))',
        'tex3Dvs(_obj, _t)': '_obj.t.sample(_obj.s,_t,level(0))',
        'tex2DArray(_obj, _t)': '_obj.t.sample(_obj.s,_t,level(0))',
        'discard': 'discard_fragment()'
    }
};

const validVsInNames = [
    'position', 'normal', 'texcoord0', 'texcoord1', 'texcoord2', 'texcoord3',
    'tangent', 'binormal', 'weights', 'indices', 'color0', 'color1',
    'instance0', 'instance1', 'instance2', 'instance3'
];
const validInOutTypes = [
    'float', 'vec2', 'vec3', 'vec4'
];

// NOTE: order is important, always go from greatest to smallest type,
// and keep texture samplers at start!
const validUniformTypes = [
    'mat4', 'mat3', 'mat2',
    'vec4', 'vec3', 'vec2',
    'float', 'int', 'bool'
];
const validUniformArrayTypes = [
    'mat4', 'vec4'
];

const uniformCType = {
    'bool':         'int',
    'int':          'int',
    'float':        'float',
    'vec2':         'glm::vec2',
    'vec3':         'glm::vec3',
    'vec4':         'glm::vec4',
    'mat2':         'glm::mat2',
    'mat3':         'glm::mat3',
    'mat4':         'glm::mat4',
};

const uniformOryolType = {
    'bool':         'UniformType::Bool',
    'int':          'UniformType::Int',
    'float':        'UniformType::Float',
    'vec2':         'UniformType::Vec2',
    'vec3':         'UniformType::Vec3',
    'vec4':         'UniformType::Vec4',
    'mat2':         'UniformType::Mat2',
    'mat3':         'UniformType::Mat3',
    'mat4':         'UniformType::Mat4',
};

const attrOryolType = {
    'float':    'VertexFormat::Float',
    'vec2':     'VertexFormat::Float2',
    'vec3':     'VertexFormat::Float3',
    'vec4':     'VertexFormat::Float4'
}

const attrOryolName = {
    'position':     'VertexAttr::Position',
    'normal':       'VertexAttr::Normal',
    'texcoord0':    'VertexAttr::TexCoord0',
    'texcoord1':    'VertexAttr::TexCoord1',
    'texcoord2':    'VertexAttr::TexCoord2',
    'texcoord3':    'VertexAttr::TexCoord3',
    'tangent':      'VertexAttr::Tangent',
    'binormal':     'VertexAttr::Binormal',
    'weights':      'VertexAttr::Weights',
    'indices':      'VertexAttr::Indices',
    'color0':       'VertexAttr::Color0',
    'color1':       'VertexAttr::Color1',
    'instance0':    'VertexAttr::Instance0',
    'instance1':    'VertexAttr::Instance1',
    'instance2':    'VertexAttr::Instance2',
    'instance3':    'VertexAttr::Instance3'
};

const validTextureTypes = ['sampler2D', 'samplerCube', 'sampler3D', 'sampler2DArray'];

const texOryolType = {
    'sampler2D':        'TextureType::Texture2D',
    'samplerCube':      'TextureType::TextureCube',
    'sampler3D':        'TextureType::Texture3D',
    'sampler2DArray':   'TextureType::TextureArray',
};

// Editor Error Helper

function fmtError(errorText) {
    throw new Error(errorText);
}
function setErrorLocation(fileName, line) {
    
}

// Helper
function checkListDup(name, objList) {
    for (const obj of objList) {
        if (name === obj.name) {
            return true;
        }
    }
    return false;
}

function findByName(name, list) {
    for (let i = 0; list.length > i; i++) {
        if (list[i].name === name) {
            return list[i];
        }
    }
    return void 0;
}

function values(obj) {
    return Object.keys(obj).map(key => obj[key]);
}

function resolveImports(str) {

}

// code generation & parsing

module.exports = function generate(inputs, importResolver) {
    importResolver = importResolver || resolveImports;
    const shaderLibrary = new ShaderLibrary(inputs, importResolver);
    shaderLibrary.parseSources();
    shaderLibrary.resolveAllDependencies();
    shaderLibrary.validate();
    return {
        programs: shaderLibrary.programs,
        vertexShaders: shaderLibrary.vertexShaders,
        fragmentShaders: shaderLibrary.fragmentShaders
    };
}
module.exports.generator = module.exports.Default = module.exports;
class ShaderLibrary {
    constructor(inputs, importResolver) {
        this.importResolver = importResolver;
        this.sources = inputs;
        this.codeBlocks = {};
        this.uniformBlocks = {};
        this.textureBlocks = {};
        this.vertexShaders = {};
        this.fragmentShaders = {};
        this.programs = {};
        this.current = void 0;
    }
    /**
     * Parse one source file.
     */
    parseSources() {
        const parser = new Parser(this);
        this.sources.forEach(source => parser.parseSource('testFile.shd', source));
    }
    /**
     * Resolve all dependencies for vertex- and fragment shaders.
     * This populates the resolvedDeps, uniformBlocks and textureBlocks arrays.
     */
    resolveAllDependencies() {
        values(this.vertexShaders).forEach(sh => sh.dependencies.forEach(dep => this.resolveDeps(sh, dep)));
        values(this.fragmentShaders).forEach(sh => sh.dependencies.forEach(dep => this.resolveDeps(sh, dep)));
        values(this.programs).forEach(program => {
            this.resolveUniformAndTextureBlocks(program);
            this.assignBindSlotIndices(program);
        });
    }
    /**
     * Recursively resolve dependencies for a shader.
     */
    resolveDeps(shd, dep) {
        if (!(dep.name in this.codeBlocks)) {
            setErrorLocation(dep.path, dep.lineNumber);
            fmtError("unknown code_block dependency '" + dep.name + "'");
        }
        shd.resolvedDeps.push(dep.name);
        for (const depdepKey in this.codeBlocks[dep.name].dependencies) {
            this.resolveDeps(shd, this.codeBlocks[dep.name].dependencies[depdepKey]);
        }
    }
    /**
     * Remove duplicates from the resolvedDeps from the front.
     * While we're at it, reverse the order so that the
     * lowest level dependency comes first.
     */
    removeDuplicateDeps(shd) {
        const deps = [];
        shd.resolvedDeps = shd.resolvedDeps.filter(dep => deps.indexOf(dep) === -1 ? false : !!deps.push(dep)).reverse();
    }
    /**
     * Gathers all uniform- and texture-blocks from all shaders in the program
     * and assigns the bindStage
     */
    resolveUniformAndTextureBlocks(program) {
        if (!this.vertexShaders[program.vs]) {
            setErrorLocation(program.filePath, program.lineNumber);
            fmtError("unknown vertex shader '{" + program.vs + "}'");
        }
        this.vertexShaders[program.vs].uniformBlockRefs.forEach(uniformBlockRef => {
            this.checkAddUniformBlock(uniformBlockRef, program.uniformBlocks);
        });
        this.vertexShaders[program.vs].textureBlockRefs.forEach(textureBlockRef => {
            this.checkAddTextureBlock(textureBlockRef, program.uniformBlocks);
        });

        if (!this.fragmentShaders[program.fs]) {
            setErrorLocation(program.filePath, program.lineNumber);
            fmtError("unknown vertex shader '{" + program.fs + "}'");
        }
        this.fragmentShaders[program.fs].uniformBlockRefs.forEach(uniformBlockRef => {
            this.checkAddUniformBlock(uniformBlockRef, program.uniformBlocks);
        });
        this.fragmentShaders[program.fs].textureBlockRefs.forEach(textureBlockRef => {
            this.checkAddTextureBlock(textureBlockRef, program.uniformBlocks);
        });
    }
    /**
     * Resolve a uniform block ref and add to list with sanity checks.
     */
    checkAddUniformBlock(uniformBlockRef, list) {
        if (uniformBlockRef.name in this.uniformBlocks) {
            if (!findByName(uniformBlockRef.name, list)) {
                list.push(this.uniformBlocks[uniformBlockRef.name]);
            }
        } else {
            setErrorLocation(uniformBlockRef.filePath, uniformBlockRef.lineNumber);
            fmtError("uniform_block '" + uniformBlockRef.name + "' not found!");
        }
    }
    /**
     * Resolve a texture block ref and add to list with sanity checks
     */
    checkAddTextureBlock(textureBlockRef, list) {
        if (textureBlockRef.name in this.textureBlocks) {
            if (!findByName(textureBlockRef.name, list)) {
                list.push(this.textureBlocks[textureBlockRef.name]);
            }
        } else {
            setErrorLocation(textureBlockRef.filePath, textureBlockRef.lineNumber);
            fmtError("texture_block '" + textureBlockRef.name + "' not found!");
        }
    }
    /**
     * Assigns bindSlotIndex to uniform-blocks and
     * to textures inside texture blocks. These
     * are counted separately for the different shader stages (each
     * shader stage has its own bind slots)
     */
    assignBindSlotIndices(program) {
        let vsUBSlot = 0;
        let fsUBSlot = 0;
        program.uniformBlocks.forEach(ub => {
            if (ub.bindStage === 'vs') {
                ub.bindSlot = vsUBSlot;
                vsUBSlot += 1;
            } else {
                ub.bindSlot = fsUBSlot;
                fsUBSlot += 1;
            }
        });
        let vsTexSlot = 0;
        let fsTexSlot = 0;
        program.textureBlocks.forEach(tb => {
            if (tb.bindStage === 'vs') {
                tb.bindSlot = vsUBSlot;
                vsTexSlot += 1;
            } else {
                tb.bindSlot = fsUBSlot;
                fsTexSlot += 1;
            }
        });
    }
    /**
     * Runs additional validation check after programs are resolved and before
     * shader code is generated:
     * 
     * - check whether vertex shader output signatures match fragment
     *   shader input signatures, this is a D3D11 requirement, signatures
     *   must match exactly, even if the fragment shader doesn't use all output
     *   from the vertex shader.
     */
    validate() {
        for (const key in this.programs) {
            const prog = this.programs[key];
            const vs = this.vertexShaders[prog.vs];
            const fs = this.fragmentShaders[prog.fs];
            let fatalError = false;
            if (vs.outputs.length !== fs.inputs.length) {
                if (fs.inputs.length > 0) {
                    setErrorLocation(fs.inputs[0].filePath, fs.inputs[0].lineNumber);
                    fmtError("number of fs inputs doesn't match number of vs outputs");
                    fatalError = true;
                }
                if (vs.outputs.length > 0) {
                    setErrorLocation(vs.inputs[0].filePath, vs.inputs[0].lineNumber);
                    fmtError("number of vs outputs doesn't match number of fs outputs");
                    fatalError = true;
                }
                if (fatalError) {
                    throw new Error('vs validation error');
                }
            } else {
                vs.outputs.forEach((outAttr, index) => {
                    if (outAttr.notEqual(fs.inputs[index])) {
                        setErrorLocation(fs.inputs[index].filePath, fs.inputs[index].lineNumber)
                        fmtError("fs input doesn't match vs output (names, types and order must match)");
                        setErrorLocation(outAttr.filePath, outAttr.lineNumber);
                        fmtError("vs output doesn't match fs input (names, types and order must match)");
                    }
                });
            }
        }
    }
    /**
     * This generates the vertex- and fragment-shader source
     * for all GLSL versions.
     */
    generateShaderSourcesGLSL() {
        const gen = new GLSLGenerator(this);
        slVersions.forEach(slVersion => {
            if (isGLSL[slVersion]) {
                values(this.vertexShaders).forEach(vs => gen.genVertexShaderSource(vs, slVersion));
                values(this.fragmentShaders).forEach(fs => gen.genFragmentShaderSource(fs, slVersion));
            }
        })
    }
}
/**
 * Populate a shader library from annotated shader source files.
 */
class Parser {
    constructor(shaderLib) {
        this.shaderLib = shaderLib;
        this.fileName = void 0;
        this.lineNumber = 0;
        this.current = void 0;
        this.stack = [];
        this.inComment = false;
        this.regexPointSize = new RegExp("[\s,;,=]*_pointsize[\s,;,=]*");
    }
    push(obj) {
        this.stack.push(obj);
        this.current = obj;
    }
    pop() {
        this.stack.pop();
        this.current = this.stack[this.stack.length - 1];
    }
    parseSource(fileName, source) {
        this.fileName = fileName;
        this.lineNumber = 0;
        source.split('\n').forEach((line, index) => {
            setErrorLocation(this.fileName, this.lineNumber);
            this.parseLine(line);
            this.lineNumber += 1;
        });
        // all blocks must be closed
        if (this.current !== void 0) {
            fmtError('missing @end at end of file');
        }
    }
    /**
     * Parse a single line.
     */
    parseLine(line) {
        line = this.stripComments(line);
        if (line !== '') {
            line = this.parseTags(line);
            this.parseSpecialKeyword(line);
            if (line !== '' && this.current !== void 0) {
                this.current.lines.push(new Line(line, this.fileName, this.lineNumber))
            }
        }
    }
    /**
     *  Remove comments from a single line, can carry
     *  over to next or from previous line.
     */
    stripComments(line) {
        let done = false;
        while (!done) {
            if (this.inComment) {
                const endIndex = line.indexOf('*/');
                if (endIndex === -1) {
                    // entire line is comment
                    if (line.indexOf('/*') !== -1 || line.indexOf('//')) {
                        fmtError('Comment in comment!');
                    }
                    return '';
                }
                const comment = line.substring(0, endIndex + 2);
                if (comment.indexOf('/*') !== -1 || comment.indexOf('//')) {
                    fmtError('Comment in comment!');
                }
                line = line.substring(endIndex + 2);
                this.inComment = false;
            }
            const wingedIndex = line.indexOf('//');
            if (wingedIndex !== -1) {
                line = line.substring(0, wingedIndex);
            }
            const startIndex = line.indexOf('/*');
            if (startIndex !== -1) {
                endIndex = line.substring(startIndex).indexOf('*/', startIndex);
                if (endIndex !== -1) {
                    line = lines.substring(0, startIndex) + line.substring(endIndex + 2);
                } else {
                    // comment carries over to next line
                    this.inComment = true;
                    line = line.substring(0, startIndex);
                    done = true;
                }
            } else {
                // no comment until end of line, done
                done = true;
            }
        }
        return line.trim();
    }
    parseTags(line) {
         const tagStartIndex = line.indexOf('@');
         if (tagStartIndex !== -1) {
             if (tagStartIndex > 0) {
                 fmtError("only whitespace allowed in front of tag");
             }
             if (line.indexOf(';') !== -1) {
                 fmtError("no semicolons allowed in tag lines");
             }
             const tagAndArgs = line.substring(tagStartIndex + 1).split(' ');
             const tag = tagAndArgs[0];
             const args = tagAndArgs.slice(1);
             switch (tag) {
                 case 'code_block':
                 case 'codeBlock':
                 this.onCodeBlock(args);
                 break;
                 case 'vs':
                 this.onVertexShader(args);
                 break;
                 case 'fs':
                 this.onFragmentShader(args);
                 break;
                 case 'useCodeBlock':
                 case 'useCodeBlock':
                 this.onUseCodeBlock(args);
                 break;
                 case 'useUniformBlock':
                 case 'use_uniform_block':
                 this.onUseUniformBlock(args);
                 break;
                 case 'use_texture_block':
                 case 'useTextureBlock':
                 this.onUseTextureBlock(args);
                 break;
                 case 'in':
                 this.onIn(args);
                 break;
                 case 'out':
                 this.onOut(args);
                 break;
                 case 'uniform_block':
                 case 'uniformBlock':
                 this.onUniformBlock(args);
                 break;
                 case 'texture_block':
                 case 'textureBlock':
                 this.onTextureBlock(args);
                 break;
                 case 'highp':
                 this.onPrecision(args);
                 break;
                 case 'program':
                 this.onProgram(args);
                 break;
                 case 'option':
                 this.onOption(args);
                 break;
                 case 'import':
                 this.onImport(args);
                 break;
                 case 'end':
                 this.onEnd(args);
                 break;
                 default:
                 fmtError(`unrecognized @ tag '${tag}'`);
                 return '';

             }
         }
         return line;
    }
    /**
     * Checks for special keywords in line, and set internal flags.
     */
    parseSpecialKeyword(line) {
        if (this.current && line.match(this.regexPointSize)) {
            this.current.hasPointSize = true;
        }
    }
    onCodeBlock(args) {
        if (args.length !== 1) {
            fmtError("@code_block must have 1 arg (name)");
        }
        if (this.current === void 0) {
            util.fmtError("@code_block must be at top level (missing @end in '{}'?)"); // .format(this.current.name)
        }
        const name = args[0];
        if (name in this.shaderLib.codeBlocks) {
            util.fmtError("@code_block '" + name + "' already defined");
        }
        const codeBlock = new CodeBlock(name);
        this.shaderLib.codeBlocks[name] = codeBlock;
    }
    onVertexShader(args) {
        if (args.length !== 1) {
            fmtError('@vs must have 1 arg (name)');
        }
        if (this.current) {
            fmtError(`cannot nest @vs (missing @end in '${this.current.name}'?)`);
        }
        const name = args[0];
        if (name in this.shaderLib.vertexShaders) {
            fmtError(`@vs '${name}' already defined`);
        }
        const vs = new VertexShader(name);
        this.shaderLib.vertexShaders[name] = vs;
        this.push(vs);
    }
    onFragmentShader(args) {
        if (args.length !== 1) {
            fmtError('@fs must have 1 arg (name)');
        }
        if (this.current) {
            fmtError(`cannot nest @fs (missing @end in '${this.current.name}'?)`);
        }
        const name = args[0];
        if (name in this.shaderLib.fragmentShaders) {
            fmtError(`@fs '${name}' already defined`);
        }
        const fs = new FragmentShader(name);
        this.shaderLib.fragmentShaders[name] = fs;
        this.push(fs);
    }
    onProgram(args) {
        if (args.length !== 3) {
            fmtError("@program must have 3 args (name vs fs)");
        }
        if (this.current) {
            fmtError(`cannot nest @program (missing @end in '${this.current.name}'?)`);
        }
        const name = args[0];
        const vs = args[1];
        const fs = args[2];
        this.shaderLib.programs[name] = new Program(name, vs, fs, this.fileName, this.lineNumber);
    }
    onIn(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@in must come after @vs or @fs!");
        }
        if (args.length !== 2) {
            fmtError("@in must have 2 args (type name)");
        }
        const type = args[0];
        const name = args[1];
        if (validInOutTypes.indexOf(type) === -1) {
            fmtError(`invalid 'in' type '${type}', must be one of '${validInOutTypes.join(', ')}'!`);
        }
        if (this.current.getTag() === 'vs') {
            if (validVsInNames.indexOf(name) === -1) {
                fmtError(`invalid input attribute name '${name}', must be one of '${validVsInNames.join(', ')}'!`);
            }
        }
        if (checkListDup(name, this.current.inputs)) {
            fmtError(`@in '${name}' already defined in '${this.current.name}'!`);
        }
        this.current.inputs.push(new Attr(type, name, this.fileName, this.lineNumber));
    }
    onOut(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@out must come after @vs or @fs!");
        }
        if (args.length !== 2) {
            fmtError("@out must have 2 args (type name)");
        }
        const type = args[0];
        const name = args[1];
        if (validInOutTypes.indexOf(type) === -1) {
            fmtError(`invalid 'out' type '${type}', must be one of '${validInOutTypes.join(', ')}'!`);
        }
        if (checkListDup(name, this.current.outputs)) {
            fmtError(`@out '${name}' already defined in '${this.current.name}'!`);
        }
        this.current.outputs.push(new Attr(type, name, this.fileName, this.lineNumber));
    }
    onUniformBlock(args) {
        if (this.current) {
            fmtError(`@uniform_block must be at top level (missing @end in '${this.current.name}'?`);
        }
        if (args.length !== 2) {
            fmtError('@uniform_block must have 2 args (name bind)');
        }
        const [name, bind] = args;
        if (this.shaderLib.uniformBlocks[name]) {
            fmtError(`@uniform_block '${name}' already defined.`);
        }
        const ub = new UniformBlock(name, bind, this.fileName, this.lineNumber);
        this.shaderLib.uniformBlocks[name] = ub;
        this.push(ub);
    }
    onTextureBlock(args) {
        if (this.current) {
            fmtError(`@texture_block must be at top level (missing @end in '${this.current.name}'?`);
        }
        if (args.length !== 2) {
            fmtError('@texture_block must have 2 args (name bind)');
        }
        const [name, bind] = args;
        if (this.shaderLib.textureBlocks[name]) {
            fmtError(`@texture_block '${name}' already defined.`);
        }
        const tb = new TextureBlock(name, bind, this.fileName, this.lineNumber);
        this.shaderLib.textureBlocks[name] = tb;
        this.push(tb);
    }
    onPrecision(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@highp must come after @vs or @fs!");
        }
        if (args.length !== 1) {
            fmtError("@out must have 1 arg (type)");
        }
        this.current.highPrecision.push(args[0]);
    }
    onUseCodeBlock(args) {
        if (!this.current || ['code_block', 'vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@code_block must come after @code_block or @vs or @fs!");
        }
        if (args.length < 1) {
            fmtError("@use_code_block must have at least one arg");
        }
        args.forEach(arg => this.current.dependencies.push(new Reference(arg, this.fileName, this.lineNumber)));
    }
    onUseUniformBlock(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@use_uniform_block must come after @vs or @fs!");
        }
        if (args.length < 1) {
            fmtError("@use_uniform_block must have at least one arg!");
        }
        args.forEach(arg => {
            if (!this.shaderLib.uniformBlocks[arg]) {
                fmtError(`unknown uniform_block name '${arg}'`);
            }
            const uniformBlock = this.shaderLib.uniformBlocks[arg];

            if (uniformBlock.bindStage !== void 0) {
                if (uniformBlock.bindStage !== this.current.getTag()) {
                    util.fmtError(`uniform_block '${arg}' cannot be used both in @vs and @fs!`);
                }
            }
            uniformBlock.bindStage = this.current.getTag();
            this.current.uniformBlockRefs.push(new Reference(arg, this.fileName, this.lineNumber));
            this.current.uniformBlocks.push(uniformBlock);
        });
    }
    onUseTextureBlock(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@use_texture_block must come after @vs or @fs!");
        }
        if (args.length < 1) {
            fmtError("@use_texture_block must have at least one arg!");
        }
        args.forEach(name => {
            if (!this.shaderLib.textureBlocks[name]) {
                fmtError(`unknown texture_block name '${name}'.`);
            }
            const textureBlock = this.shaderLib.textureBlocks[name];
            if (textureBlock.bindStage !== void 0) {
                if (textureBlock.bindStage !== this.current.getTag()) {
                    fmtError(`texture_block '${name}' cannot be used both in @vs and @fs!`);
                }
            }
            textureBlock.bindStage = this.current.getTag();
            this.current.textureBlockRefs.push(new Reference(name, this.fileName, this.lineNumber));
            this.current.textureBlocks.push(textureBlock);
        });
    }
    onOption(args) {
        if (!this.current) {
            fmtError("@option cant be standalone");
        }
        if (args.length === 0) {
            fmtError("@option needs at least one argument");
        }
        const [name] = args;
        if (this.current.options[name]) {
            fmtError(`@option '${name}' already exists.`);
        }
        this.current.options[name] = args.slice(1).map(arg => {
            if (!Number.isNaN(Number(arg))) {
                return Number(arg);
            }
            if (arg === 'true') {
                return true;
            }
            if (arg === 'false') {
                return false;
            }
            return arg;
        });
    }
    onImport(args) {
        fmtError("@import is not supported yet");
        if (args.length !== 1) {
            fmtError("@import only has one argument");
        }
    }
    onEnd(args) {
        if (!this.current || ['uniform_block', 'texture_block', 'code_block', 'vs', 'fs', 'program'].indexOf(this.current.getTag()) === -1) {
            fmtError("@end must come after @uniform_block, @texture_block, @code_block, @vs, @fs or @program!");
        }
        if (args.length !== 0) {
            fmtError("@end must not have arguments");
        }
        if (['code_block', 'vs', 'fs'].indexOf(this.current.getTag()) !== -1 && this.current.lines === 0) {
            fmtError("no source code lines in @code_block, @vs or @fs section");
        }
        if (this.current.getTag() === 'uniform_block') {
            this.current.parseUniforms();
        }
        if (this.current.getTag() === 'texture_block') {
            this.current.parseTextures();
        }
        this.pop();
    }
}

/**
 * A line object with mapping to a source file and line number.
 */
class Line {
    constructor(content, path, lineNumber) {
        this.content = content;
        this.path = path;
        this.lineNumber = lineNumber;
    }
}
/**
 * A reference to another named object, with information where the
 * ref is located (source, linenumber)
 */
class Reference {
    constructor(name, path, lineNumber) {
        this.name = name;
        this.path = path;
        this.lineNumber = lineNumber;
    }
}
/**
 * A code block snippet.
 */
class CodeBlock {
    constructor(name) {
        this.name;
    }
    getTag() {
        return 'code_block';
    }
    dump() {
        Snippet.dump(this);
    }
}
/**
 * A shader uniform definition.
 */
class Uniform {
    constructor(type, num, name, bindName, filePath, lineNumber) {
        this.type = type;
        this.name = name;
        this.bindName = bindName;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.num = num;
    }
}
/**
 * A group of related shader uniforms.
 */
class UniformBlock {
    constructor(name, bindName, filePath, lineNumber) {
        this.name = name;
        this.bindName = bindName;
        this.bindStage = void 0;
        this.bindSlot = void 0;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.lines = [];
        this.uniforms = [];
        this.uniformsByType = {};
        // uniformsByType must be in the order of greatest to smallest
        // type, with samplers at the start
        validUniformTypes.forEach(type => this.uniformsByType[type] = []);
    }
    getTag() {
        return 'uniform_block';
    }
    parseUniformType(arg) {
        return arg.split('[')[0];
    }
    parseUniformArraySize(arg) {
        const tokens = arg.split('[');
        return tokens.length > 1 ? Number(token[1].strip[']']) : 1;
    }
    parseUniforms() {
        const lines = this.lines.slice(1);
        for (const line of lines) {
            setErrorLocation(line.path, line.lineNumber);
            const tokens = line.content.split(' ');
            if (tokens.length !== 3) {
                fmtError("uniform must have 3 args (type name binding)");
            }
            const type = this.parseUniformType(tokens[0]);
            const num = this.parseUniformArraySize(tokens[0]);
            const name = tokens[1];
            const bind = tokens[2];
            if (validUniformTypes.indexOf(type) === -1) {
                fmtError("invalid uniform type '" + type + "', must be one of '" + validUniformTypes.join(', ') + "'!");
            }
            // additional type restrictions for uniform array types (because of alignment rules)
            if (num > 1 && validUniformArrayTypes.indexOf(type) === -1) {
                fmtError(`invalid uniform array type '${type}', must be '${validUniformArrayTypes.join('\n')}'!`);
            }
            if (checkListDup(name, this.uniforms)) {
                fmtError(`uniform '${name}' already defined in '${this.name}'!`);
            }
            const uniform = new Uniform(type, num, name, bind, line.path, line.lineNumber);
            this.uniforms.push(uniform);
            this.uniformsByType[type].push(uniform);
        }
    }
}
/**
 * A texture shader parameter
 */
class Texture {// type, name, bind, addressU, addressV, minFilter, magFilter, maxAnisotropy, 
    constructor(type, name, bindName, addressU, addressV, minFilter, magFilter, maxAnisotropy = 1,  filePath, lineNumber) {
        this.type = type;
        this.name = name;
        this.bindName = bindName;
        this.bindSlot = void 0;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        if (addressU) {
            this.sampler = {
                addressU,
                addressV,
                minFilter,
                magFilter,
                maxAnisotropy,
            };
        }
    }
}
/**
 * A group of related textures.
 */
class TextureBlock {
    constructor(name, bindName, filePath, lineNumber) {
        this.name = name;
        this.bindName = bindName;
        this.bindStage = void 0;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.lines = [];
        this.textures = [];
    }
    getTag() {
        return 'texture_block';
    }
    parseTextures() {
        const lines = this.lines.slice(1);
        for (const line of lines) {
            setErrorLocation(line.path, line.lineNumber);
            const tokens = line.content.split(' ');
            if (tokens.length !== 3 && tokens.length !== 7 && tokens.length !== 8) {
                fmtError("texture must have 3 args (type name binding) or 7-8 args (type name binding addressU addressV minFilter magFilter [maxAnisotropy])");
            }
            const [type, name, binding, addressU, addressV, minFilter, magFilter, maxAnisotropy] = tokens;
            
            if (validTextureTypes.indexOf(type) === -1) {
                fmtError("invalid texture type '" + type + "', must be one of '" + validTextureTypes.join(', ') + "'!");
            }
            if (checkListDup(name, this.textures)) {
                fmtError("texture '" + name + "' already defined in '" + this.name + "'!");
            }
            this.textures.push(new Texture(type, name, binding, addressU, addressV, minFilter, magFilter, maxAnisotropy, line.path, line.lineNumber));
        }
    }
}

class Attr {
    constructor(type, name, filePath, lineNumber) {
        this.type = type;
        this.name = name;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
    }
    equal(other) {
        return (this.type === other.type) && (this.name === other.name);
    }
    notEqual(other) {
        return !this.equal(other);
    }
}
class Shader {
    constructor(name) {
        this.name = name;
        this.lines = [];
        this.options = {};
        this.dependencies = [];
        this.highPrecision = [];
        this.uniformBlockRefs = [];
        this.uniformBlocks = [];
        this.textureBlockRefs = [];
        this.textureBlocks = [];
        this.inputs = [];
        this.outputs = [];
    }
    getAnnotatedSource() {
        return this.lines.slice(1);
    }
}

/**
 * A vertex shader function.
 */
class VertexShader extends Shader {
    constructor(name) {
        super(name);
        this.inputLayout = [];
    }
    getTag() {
        return 'vs';
    }
}

/**
 * A fragment shader function.
 */
class FragmentShader extends Shader {
    constructor(name) {
        super(name);
    }
    getTag() {
        return 'fs';
    }
}

/**
 * A shader program, made of vertex/fragment shaders
 */
class Program {
    constructor(name, vs, fs, filePath, lineNumber) {
        this.name = name;
        this.options = {};
        this.vs = vs;
        this.fs = fs;
        this.uniformBlocks = [];
        this.textureBlocks = [];
        this.filePath = filePath;
        this.lineNumber = lineNumber;
    }
    getTag() {
        return 'program';
    }
}
/**
 * A pipline state
 */
class State {
    constructor(name) {
        this.name = name;
        this.options = {};
    }
    getTag() {
        return 'state';
    }
}
/**
 * A render pass
 */
class Pass {
    constructor(name) {
        this.name = name;
        this.options = {};
    }
    getTag() {
        return 'pass';
    }
}