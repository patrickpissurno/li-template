module.exports = function(){ return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="Compiled HTML templates with ES6 literals for Node.js: li-template">
        <meta name="author" content="Patrick Pissurno">

        <title>${this.title} | Native HTML templating engine with ES6 literals</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css" integrity="sha256-akwTLZec/XAFvgYgVH1T5/369lhA2Efr22xzCNl1nHs=" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <style> hr { margin-top: 2rem; margin-bottom: 2rem; } </style>
    </head>

    <body>
        <div class="container pb-5">
            <h1 class="display-4 mt-5 mb-3" style="line-height: 0.8!important">${this.title}</h1>
            <h3 class="lead mb-5" style="font-size: 1.75rem">Native HTML templating engine with ES6 literals compiled into plain Node.js modules</h3>

            <h2>How it works</h2>
            <p>li-template (pronounced "<i>lite and plate</i>", altogether) works by transpiling .lit template files (HTML + ES6 template literals) into plain ES6 template literals and then compiling them as Node.js modules. By doing this, you can harness maximum performance, as the Node's V8 JIT compiler can fully optimize.<br><br>This library also leverages the power of template literals by supporting some other cool stuff:</p>
            <ul>
                ${this.features ? `${this.features.map(item => `<li>${item}</li>`).join('')}` : ''}            </ul>
            <p>This templating engine was inspired by Mustache and is <b>intended to be used in a <i>logic-less</i> fashion.</b></p>
            <p class="h3 text-muted font-weight-light mb-3">However...</p>
            <p>It was made in a way so you could use <b>as much logic as you would like to</b>. All things from Javascript can be used inside your templates.</p>
    
            <hr>
            <h2>Information</h2>
            ${!this.static || this.static.length == 0 ? `<p>This page is being rendered by <b>li-template</b> and served by <b>Express 4</b> under <b>Node.js ${process.version}</b></p>` : ''}            ${this.static ? `<p>This page was rendered by <b>li-template CLI</b> under <b>Node.js ${process.version}</b> and is hosted on GitHub pages. Yes, it's great for static generated content too.</p>` : ''}
            ${this.syntax ? `<hr>
                <h2>Dead simple and hyper fast</h2>
                <p>You don't have to learn anything at all. You can just start writing normal ES6 Javascript and do whatever you want. But to make thing even better, we've added a syntax-sugar on top of plain ES6 template literals, our so-called <b>short-hands</b>. They do the very same thing that you could do by writing plain javascript. But they're more compact and concise. There are just three:</p>

                ${this.syntax.shorthands ? `${this.syntax.shorthands.map(item => `<h3>${item.title} <small>${item.titleHelp}</small></h3>
                    <b>Short-hand</b>
                    <br>
                    <pre><code class="html">${safe(item.before)}</code></pre>
                    <b>Transpiles into</b>
                    <br>
                    <pre class="mb-5"><code class="html">${safe(item.after)}</code></pre>`).join('')}` : ''}

                <h2>Basic syntax</h2>
                <p class="mb-5">Inside <code class="html">\${}</code> you can use whatever from Javascript you would like to. Functions, methods, properties, <code class="js">process.env</code>... Whatever. Just keep in mind that whatever you do write in there, would have to work with plain <code class="javascript">\`\${}\`</code> template literals under a Node.js module context.</p>

                <h3>String template <small>(replace)</small></h3>
                <p>This one is just like plain ES6 template literals. Whatever you do write in there will be passed as is into the NodeJS compiled module</p>
                <pre><code class="html">\${this.something}</code></pre>
                <p class="mb-5">In this case, it will be replaced at render time with <code class="js">this.something</code>'s value.</p>

                <h3>Escaping content</h3>
                <p>li-template by default <b>doesn't escape anything</b>. So you are 100% vulnerable to XSS attacks or something. This is intended by design, as we want to achieve <b>maximum performance</b>.</p>
                <p class="mb-5">But this doesn't mean that we're going to leave you on your own. We offer a method that is accessible from within <b>ALL</b> .lit template files <b>that will escape just anything</b>. Just call <code class="js">\${safe(this.somethingDangerous)}</code> and you'll be fine. It's easy!</p>

                <h3>Escaping li-template</h3>
                <p>Sometimes li-template may conflict with third-party libraries like <i>inline</i> jQuery. No problem! Just use the <i>backslash</i> (<code class="js">\\</code>) before the dollar sign (<code class="js">$</code>) and <i>li-template</i> is going to ignore that tag.</p>
                <p>Also, regular Javascript Template Literals rules apply. You'll have to escape those <i>literal markers</i> (<code class="js">\`</code>) by using a <i>backslash</i> (<code class="js">\\</code>). For displaying the backslash, just double it like this <code class="js">\\\\</code>.</p>` : ''}            
            ${this.source ? `<hr>

                <h2>Take a look at this page's source</h2>
                <h3 class="text-muted font-weight-light mt-3">index.lit</h3>
                <pre><code class="html">${safe(this.source.index)}</code></pre>
                <h3 class="text-muted font-weight-light mt-4">footer.lit</h3>
                <pre><code class="html">${safe(this.source.footer)}</code></pre>` : ''}    
            <hr>
            <h2>Enjoying it?</h2>
            <p>Give it a shot! It's free and open-source!</p>
            <a href="https://github.com/patrickpissurno/li-template" class="btn btn-lg btn-outline-primary mb-2" target="_blank"><i class="fab fa-github"></i> Source code</a>
            <a href="https://www.npmjs.com/package/li-template" class="btn btn-lg btn-outline-primary mb-2" target="_blank"><i class="fab fa-npm"></i> Get it now</a>

        </div>

        ${this.partials ? `${this.partials.footer}` : ''}

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js" integrity="sha256-/BfiIkHlHoVihZdc6TFuj7MmJ0TWcWsMXkeDFwhi0zw=" crossorigin="anonymous"></script>
        <script defer src="https://use.fontawesome.com/releases/v5.0.6/js/all.js"></script>
        <script>hljs.initHighlightingOnLoad();</script>
    </body>
</html>
        `; };