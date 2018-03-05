const lit = require('../lit');
const express = require('express');
const fs = require('fs');
const app = express();

let sourceCode = { //not needed, just here as we want to show the source inside the rendered page
    demo: fs.readFileSync('demo.lit').toString(),
    footer: fs.readFileSync('footer.lit').toString()
};

(async () => {
    let render = await lit.compileFile('demo.lit', ['footer.lit']);

    app.get('/', async (req, res) => {
        let data = {
            title: 'li-template demo',
            features: [
                'Template files are compiled into NodeJS modules and in-memory cached',
                'Partials and compiled partials',
                'Short-hand for <i>exists</i> statement',
                'Short-hand for <i>non-exists or empty</i> statement',
                'Short-hand for <i>loops</i>',
                'Every thing you can do with Javascript',
                'Ultra small size'
            ],
            source: {
                demo: sourceCode.demo,
                footer: sourceCode.footer
            },
        };
        if(req.query.name != null)
        {
            data.user = {
                name: req.query.name,
                age: req.query.age ? req.query.age : '?',
                followers: [
                    { name: 'Drake', friends: ['Mom', 'Dad', 'Josh'] },
                    { name: 'Josh', friends: [ 'Drake', 'Sugar' ] },
                ]
            };
        }
        res.send(await render(data));
    })

    app.listen(3000, () => console.log('Running on 3000'));
})();