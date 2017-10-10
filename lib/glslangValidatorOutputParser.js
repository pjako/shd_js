/**
 * Parse error output lines from the GLSL reference compiler,
 * map them to the original source code location and output
 * an error message compatible with Xcode or VStudio} str  
 * @param {string} str 
 */
function glslangValidatorOutputParser(str) {
    const errors = [];
    const lines = (str || '').split('\n');
    lines.forEach(line => {
        if (line.startsWith('ERROR: ')) {
            line = line.replace('ERROR: ', '');
            const lineStartIndex = line.indexOf(':') + 1;
            if (lineStartIndex === 0) {
                return;
            }
            const lineEndIndex = line.indexOf(':', lineStartIndex);
            if (lineEndIndex === -1) {
                return;
            }
            const msgStartIndex = lineEndIndex + 1;
            const lineNr = Number(line.substring(lineStartIndex, lineEndIndex));
            console.log(lineNr);
            if (isNaN(lineNr)) {
                return;
            }
            const msg = line.substring(lineNr);

            // map to original location 
            const lineIndex = lineNr - 1;
            errors.push({
                lineIndex,
                msg
            });
        }
    });
    console.log('glslangValidatorOutputParser', errors.length);

    return errors;
}
module.exports = glslangValidatorOutputParser;
module.exports.glslangValidatorOutputParser = glslangValidatorOutputParser;
module.exports.default = glslangValidatorOutputParser;