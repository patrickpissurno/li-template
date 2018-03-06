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

    export function compile(raw: string, partials: IPartial[], opt?:{ filename?: string, precompiled?: string }): Promise<IRenderer>;
    export function compileFile(filename: string, partials: IPartial[]): Promise<IRenderer>;
    export function compilePartials(partialsFileNames: string[], templateName?: string): Promise<IPartial[]>;
    export function precompile(raw: string): string;
    export function precompileFile(filename: string): Promise<String>;
 }