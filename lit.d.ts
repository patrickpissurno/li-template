// Type definitions for li-template
// Project: li-template
// Definitions by: Patrick Pissurno <https://patrickpissurno.com.br>

export = Lit;

declare namespace Lit {

    export interface IPartial {
        name: string;
        render: IRenderer;
    }

    export interface IRenderer {
        (data: object): string;
    }

    /**
     * 
     * Async compile a template by passing its raw content
     * @export
     * @param {string} raw Template's raw content
     * @param {IPartial[]} partials Array of already compiled partial files
     * @param {{ filename?: string, precompiled?: string }} [opt] Optional parameters
     * @returns {Promise<IRenderer>} The compiled render function wrapped in a Promise
     */
    export function compile(raw: string, partials: IPartial[], opt?:{ filename?: string, precompiled?: string }): Promise<IRenderer>;
    
    /**
     * 
     * Async compile a template by passing its file name
     * @export
     * @param {string} filename Template's file name
     * @param {string[]} partials An array containing the file names of all partials needed for this template
     * @returns {Promise<IRenderer>} The compiled render function wrapped in a Promise
     */
    export function compileFile(filename: string, partials: string[]): Promise<IRenderer>;

    /**
     * 
     * Async compile partials from a string array of file names
     * @export
     * @param {string[]} partialsFileNames An array containing the file names of all partials needed for this template
     * @param {string} [templateName] This template's file name
     * @returns {Promise<IPartial[]>} Array of compiled partial files wrapped in a Promise
     */
    export function compilePartials(partialsFileNames: string[], templateName?: string): Promise<IPartial[]>;

    /**
     * 
     * Pre-compile a template by passing its raw content
     * @export
     * @param {string} raw Template's raw content
     * @returns {string} The pre-compiled render module (as a string)
     */
    export function precompile(raw: string): string;

    /**
     * 
     * Pre-compile a template by passing its file name
     * @export
     * @param {string} filename Template's file name
     * @returns {Promise<String>} The pre-compiled render module (as a string) wrapped in a Promise
     */
    export function precompileFile(filename: string): Promise<String>;
 }