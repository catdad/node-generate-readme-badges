#!/usr/bin/env node
/* jshint node: true, esversion: 6 */

var url = require('url');

var argv = require('yargs').argv;

var pkg = function() {
    try {
        return require(argv.package || './package.json');
    } catch(e) {
        return {};
    }
}();

var USER = process.env.USER || argv.user;
var NAME = process.env.NAME || argv.name || pkg.name;

// attempt to figure out username from package repo
if (
    pkg.repository &&
    pkg.repository.url &&
    pkg.repository.type === 'git' &&
    /github\.com\//.test(pkg.repository.url)
) {

    var parsedRepo = url.parse(pkg.repository.url);
    var tokens = parsedRepo.path.split('/').filter( v => !!v );
    
    USER = USER || tokens[0];
}

// because why not
console.log(`
[![Build][1]][2]
[![Test Coverage][3]][4]
[![Code Climate][5]][6]
[![Downloads][7]][8]
[![Version][9]][8]
[![Dependency Status][10]][11]

[1]: https://travis-ci.org/${USER}/${NAME}.svg?branch=master
[2]: https://travis-ci.org/${USER}/${NAME}

[3]: https://codeclimate.com/github/${USER}/${NAME}/badges/coverage.svg
[4]: https://codeclimate.com/github/${USER}/${NAME}/coverage

[5]: https://codeclimate.com/github/${USER}/${NAME}/badges/gpa.svg
[6]: https://codeclimate.com/github/${USER}/${NAME}

[7]: https://img.shields.io/npm/dm/${NAME}.svg
[8]: https://www.npmjs.com/package/${NAME}
[9]: https://img.shields.io/npm/v/${NAME}.svg

[10]: https://david-dm.org/${USER}/${NAME}.svg
[11]: https://david-dm.org/${USER}/${NAME}
`);
