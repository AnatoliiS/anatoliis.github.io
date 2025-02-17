'use strict';
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const sh = require('shelljs');
const uglifyjs = require('uglify-js');

module.exports = function renderScripts() {

    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/js');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    
    sh.cp('-R', sourcePath, destPath)

    const sourcePathScriptsJS = upath.resolve(upath.dirname(__filename), '../src/js/scripts.js');
    const destPathScriptsJS = upath.resolve(upath.dirname(__filename), '../dist/js/scripts.min.js');
    
    const copyright = `/*!
* ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
* Copyright 2011-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license} (${packageJSON.homepage}/blob/master/LICENSE)
*/
`
    const scriptsJS = uglifyjs.minify(fs.readFileSync(sourcePathScriptsJS, 'utf8')).code;
    
    fs.writeFileSync(destPathScriptsJS, copyright + scriptsJS);
};