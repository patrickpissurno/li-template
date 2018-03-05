#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const path = require('path');
const cmd = require('commander');
const lit = require('./lit');

cmd
    .description('Command-line tool for pre-compiling or rendering li-template directly')
    .option('-i, --input <input>', 'Input file or directory')
    .option('-o, --output <output>', 'Output file or directory')
    .option('-r --render', 'Tells li-tempate to look for JSON files and render them')
    .parse(process.argv)

if(cmd.input != null && cmd.output != null){
    let input = cmd.input;
    let output = cmd.output;
    let render = cmd.render != null;

    let inputFiles = [];
    let outputDirectory;
    let outputFile;

    try
    {
        if(fs.lstatSync(input).isDirectory())
        {
            fs.readdirSync(input)
                .filter(x => fs.lstatSync(path.join(input, x)).isFile() && path.parse(path.join(input, x)).ext.toLowerCase() == '.lit')
                .forEach(x => inputFiles.push(path.join(input, x)));
        }
        else if(fs.lstatSync(input).isFile())
            inputFiles.push(input);
        else
        {
            console.error('Invalid input file');
            process.exit(1);
        }
    }
    catch(ex){
        console.error('The specified input file doesn\'t exist. Stack:');
        console.error(ex);
        process.exit(1);
    }

    try
    {
        if(!fs.lstatSync(output).isDirectory())
        {
            if(inputFiles.length !== 1)
            {
                console.error(`There are ${inputFiles.length} input file${inputFiles.length != 1 ? 's' : ''} for just 1 output file`);
                process.exit(1);
            }
            else
                outputFile = output;
        }
        else
            outputDirectory = output;
    }
    catch(ex){
        console.error('The specified output file doesn\'t exist. Stack:');
        console.error(ex);
        process.exit(1);
    }

    (async() => {

        let precompiled;
        try
        {
            precompiled = await Promise.all(inputFiles.map(async x => await lit.precompileFile(x)));
        }
        catch(ex){
            console.error('There was a problem pre-compiling your files. Stack:');
            console.error(ex);
            process.exit(1);
        }

        let rendered = [];
        if(render)
        {
            let data;
            try
            {
                data = inputFiles.map(x => fs.readFileSync(x + '.json'));
                data = data.map(x => JSON.parse(x));
            }
            catch(ex){
                console.error('There was a problem reading your template.lit.json files. Stack:');
                console.error(ex);
                process.exit(1);
            }

            let compiled;
            try
            {
                compiled = await Promise.all(precompiled.map(async x => await lit.compile('', null, { precompiled: x })));
            }
            catch(ex){
                console.error('There was a problem compiling your files to render them. Stack:');
                console.error(ex);
                process.exit(1);
            }

            try
            {
                for(let i = 0; i<compiled.length; i++)
                    rendered.push(compiled[i](data[i]));
            }
            catch(ex){
                console.error('There was a problem rendering your template files. Stack:');
                console.error(ex);
                process.exit(1);
            }

        }

        try
        {
            if(outputFile != null)
            {
                fs.writeFileSync(outputFile + '.js', precompiled[0]);

                if(rendered.length === 1)
                    fs.writeFileSync(outputFile + '.html', rendered[0])
            }
            else if(outputDirectory != null)
            {
                let promises = [];
                for(let i = 0; i<precompiled.length; i++){
                    let filePath = path.parse(inputFiles[i]);
                    promises.push(writeFile(path.join(outputDirectory, filePath.name + '.js'), precompiled[i]));

                    if(i < rendered.length)
                        promises.push(writeFile(path.join(outputDirectory, filePath.name + '.html'), rendered[i]));
                }
                await Promise.all(promises);
            }
            else
            {
                console.error('No valid output directory specified. This shoudln\'t be hapenning, though');
                process.exit(1);
            }
        }
        catch(ex){
            console.error('There was a problem writting your files to disk. Stack:');
            console.error(ex);
            process.exit(1);
        }

        console.log(`Pre-compile${render ? ' and render' : ''} success!`);

    })();
}