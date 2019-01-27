# li-template
HTML template literals view engine with compiler for plain Node.js modules

## Official page
Documentation and examples are available at [https://patrickpissurno.com.br/li-template](https://patrickpissurno.com.br/li-template)

## Downloads
- Source code on [GitHub](https://github.com/patrickpissurno/li-template)
- Get it from [NPM](https://www.npmjs.com/package/li-template)

## How it works
li-template (pronounced "_lite and plate_") works by **transpiling** .lit template files (HTML + ES6 template literals) into plain ES6 template literals and then **compiling them as Node.js modules**. By doing this, you can harness **maximum performance**, as the Node's V8 JIT compiler can fully optimize.

This library also **leverages** the power of template literals by supporting some other cool stuff:
- Template files are **compiled** into NodeJS modules and in-memory **cached**
- **Partials** and compiled partials
- Short-hand for _exists_ statement
- Short-hand for _non-exists or empty_ statement
- Short-hand for _loops_
- **Every thing** you can do with Javascript
- Ultra small size
- Blazing fast

This templating engine was inspired by Mustache and is **intended to be used in a logic-less fashion**.

### However

It was made in a way so you could use **as much logic as you would like to**. All things from Javascript can be used inside your templates.

## Dead simple and hyper fast
You don't have to learn anything at all. You can just start writing normal ES6 Javascript and do whatever you want. But to make thing even better, we've added a syntax-sugar on top of plain ES6 template literals, our so-called **short-hands**. They do the very same thing that you could do by writing plain javascript. But they're more compact and concise. There are just three:

### Exists (if something is not null)
**Short-hand**

```$(this.something?){<b>${this.something}</b>}```

**Transpiles into**

```${this.something ? `<b>${this.something}</b>` : ''}```


### Non-exists or empty (if something is null or something.length === 0)
**Short-hand**

```$(!this.something?){<b>Empty</b>}```

**Transpiles into**

```${this.something == null || this.something.length === 0 ? `<b>Empty</b>` : ''}```


### Loops
**Short-hand**

```$(this.names:name){<b>I'm ${name}</b>}```

**Transpiles into**

```${this.names.map(x => `<b>I'm ${x.name}</b>`).join('')}```


## Basic syntax
Inside ```${}``` you can use whatever from Javascript you would like to. Functions, methods, properties, process.env... Whatever. Just keep in mind that whatever you do write in there, would have to work with plain ````${}```` template literals in Node.js module context.

### String template (replace)
This one is just like plain ES6 template literals.

```${this.something}```

It will be replaced at render time with _this.something_'s value.

### Escaping content
li-template by default **doesn't escape anything**. So you are 100% vulnerable to XSS attacks or something. This is intended by design, as we want to achieve **maximum performance**. But this doesn't mean that we're going to leave you on your own. We offer a method that is accessible from within **ALL** .lit template files **that will escape anything**. Just call ```${safe(this.somethingDangerous)}``` and you'll be fine. It's easy!

### Escaping li-template
Sometimes li-template may conflict with third-party libraries like inline jQuery. No problem! Just use the backslash before the dollar sign and li-template is going to ignore that tag.

Like this: ```\$('.my-jquery-selector')```

## Take a look at the demo
There is a [demo](https://github.com/patrickpissurno/li-template/tree/master/demo) where you can play around and learn by yourself. Just clone this repo and you'll find it inside the demo folder. Run ```npm install && node demo.js```and open your browser at [localhost:3000](http://localhost:3000) to play around a little bit. Or see a [running example here](https://patrickpissurno.com.br/li-template)

## Downloads
- Source code on [GitHub](https://github.com/patrickpissurno/li-template)
- Get it from [NPM](https://www.npmjs.com/package/li-template)
- Documentation [page](https://patrickpissurno.com.br/li-template)

## License
MIT License

Copyright (c) 2018-2019 [Patrick Pissurno](https://patrickpissurno.com.br/)

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.