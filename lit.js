/** 
 * li-template was developed by Patrick Pissurno
 * and is licensed under the MIT license.
 */

const crypto = require('crypto');
const util = require('util');
const fs = require('fs');
const path = require('path');
const randomBytes = util.promisify(crypto.randomBytes);
const readFile = util.promisify(fs.readFile);

async function rand(){
    return (await randomBytes(48)).toString('hex');
}

// Used to find the matching } of a given {
function getClosing(code, sI){
    let limit = 10000;
    let index = sI;
    let nest = 0;
    while(index < code.length)
    {
        let open = code.indexOf('{', index);
        let close = code.indexOf('}', index);

        if(close == -1)
            return index;
        else if(open == -1)
            open = close + 1;

        index = open < close ? open : close;
        nest += open < close ? 1 : -1;

        index ++;

        if(nest <= 0)
            return index;

        limit -= 1;
        if(limit < 0)
            return -9;
    }
    return index;
}

// Transpiles the short-hand syntax-sugar into plain ES6 template literals
function transpile(str){
	let patt = RegExp(/\$\(/);
    let index = 0;
    let lastMatchIndex = 0;

    let result = '';
    while (match = patt.exec(str.substring(index, str.length))) {

        let start = index + match.index + 2;
        let end = str.indexOf(')', start);

        if(str.substring(end - 1, end) === '?') //if and else syntax
        {
			result += str.substring(lastMatchIndex + 1, start - 2);

            let variable = str.substring(start, end - 1);

            let blockStart = str.indexOf('{', end) + 1;
            let blockEnd = getClosing(str, blockStart - 1);
            let block = str.substring(blockStart, blockEnd - 1);

            lastMatchIndex = blockEnd;

            index = blockEnd + 1;

            let inner = transpile(' ' + block + ' ');
            result += `\${${ variable + (variable.indexOf('!') !== -1 ? ' || ' + variable.replace('!', '') + '.length == 0' : '') } ? \`${ inner == '' ? block : inner }\` : ''}`;
        }
        else if(str.substring(start, end).indexOf(':') !== -1) //loops syntax
        {
            result += str.substring(lastMatchIndex + 1, start - 2);
            
            let arr = str.substring(start, end).split(':').map(x => x.trim());

            let blockStart = str.indexOf('{', end) + 1;
            let blockEnd = getClosing(str, blockStart - 1);
            let block = str.substring(blockStart, blockEnd - 1);

            lastMatchIndex = blockEnd;

            index = blockEnd + 1;

            let inner = transpile(' ' + block + ' ');
            result += `\${${ arr[0] } ? \`\${${arr[0]}.map(${arr[1]} => \`${ inner == '' ? block : inner }\`).join('')}\` : ''}`;
        }
        else //no pattern found, skip
        {
            index += 1;
            continue;
        }
    }

    result += str.substring(index - 1, str.length + (lastMatchIndex == 0 ? -1 : 0));
    return result.trim();
};

class Lit {
    /**
     * Pre-compiles a template in order to use the view engine by passing its raw content
     * @param {string} src Template source
     * @returns The pre-compiled render module that is used to render the template as a string 
     * @memberof Lit
     */
    precompile(src){
        return `module.exports = function(){ return \`${
            transpile(`  ${
                src.replace(/\\\$\(/g, '\\$@(')
            }  `).replace(/\\\$@\(/g, '\\$(')}
        \`; };`;
    }

    /**
     * Compile a template in order to use the view engine by passing its raw content as string
     * @param {string} raw Template raw content as string
     * @param {Object[]} partials Array of already compiled partial files
     * @param {string} [filename] A string name that will be used as Node compiled module name. If omitted, random string is used
     * @returns The compiled render function that is used to render the template
     * @memberof Lit
     */
    async compile(raw, partials, opt = { filename: null, precompiled: null }){
        const m = new module.constructor();
        m.paths = module.paths;
        let template = `
            const htmlEscapes = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '/': '&#x2F;'
            };
            const htmlEscaper = /[&<>"'\/]/g;
            function safe(str) {
                return ('' + str).replace(htmlEscaper, function(match) {
                    return htmlEscapes[match];
                });
            };
            ${opt.precompiled == null ? this.precompile(raw) : opt.precompiled}`;
        try
        {
            m._compile(template, opt.filename == null ? await rand() : opt.filename);
        }
        catch(ex)
        {
            console.error(ex);
        }

        return (data) => {
            if(partials != null)
            {
                let temp = {};
                partials.forEach(x => temp[x.name] = x.render(data));
                data.partials = temp;
            }
            return m.exports.bind(data)();
        };
    }

    /**
     * Compile a template in order to use the view engine by passing its file name
     * @param {string} filename Template file name
     * @param {string[]} partials An array containing the file names of all partials needed for this template
     * @returns The compiled render function that is used to render the template
     * @memberof Lit
     */
    async compileFile(filename, partials){
        if(partials != null)
            partials = await this.compilePartials(partials, filename);
        
        return await this.compile((await readFile(filename)).toString(), partials, filename);
    }

    /**
     * Compile partials from a string array of file names
     * @param {string[]} partials An array containing the file names of all partials needed for this template
     * @param {string} [filename] Base template file name
     * @returns An array containing the partials as objects
     * @memberof Lit
     */
    async compilePartials(partials, filename){
        if(partials == null)
            return null;
        
        return await Promise.all(partials.map(async x => {
            return typeof(x) == 'string' ? {
                render: await this.compile((await readFile(x)).toString(), null, path.parse(x).name + '_' + (filename == null ? await rand() : filename)),
                name: path.parse(x).name
            } :
            {
                render: await this.compile((await readFile(x.file)).toString(), await this.compilePartials(x.partials, x.file), path.parse(x.file).name + '_' + (filename == null ? await rand() : filename)),
                name: path.parse(x.file).name
            };
        }));
    }

    /**
     * Pre-compiles a template in order to use the view engine by passing its file name
     * @param {string} filename Template file name
     * @returns The pre-compiled render function that is used to render the template as a string
     * @memberof Lit
     */
    async precompileFile(filename){        
        return this.precompile((await readFile(filename)).toString());
    }
};

module.exports = new Lit();