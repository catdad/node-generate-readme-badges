#!/usr/bin/env node
/* jshint node: true, esversion: 6 */

var url = require('url');
var path = require('path');

var argv = require('yargs').argv;

var pkg = function() {
    var pkgPath = path.resolve(process.cwd(), 'package.json');
    
    try {
        return require(argv.package || pkgPath);
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
[![Build][travis.svg]][travis.link]
[![Test Coverage][cov-codeclimate.svg]][cov-codeclimate.link]
[![Code Climate][gpa-codeclimate.svg]][gpa-codeclimate.link]
[![Downloads][npm-downloads.svg]][npm.link]
[![Version][npm-version.svg]][npm.link]
[![Dependency Status][dm-david.svg]][dm-david.link]

[travis.svg]: https://travis-ci.org/${USER}/${NAME}.svg?branch=master
[travis.link]: https://travis-ci.org/${USER}/${NAME}

[cov-codeclimate.svg]: https://codeclimate.com/github/${USER}/${NAME}/badges/coverage.svg
[cov-codeclimate.link]: https://codeclimate.com/github/${USER}/${NAME}/coverage

[gpa-codeclimate.svg]: https://codeclimate.com/github/${USER}/${NAME}/badges/gpa.svg
[gpa-codeclimate.link]: https://codeclimate.com/github/${USER}/${NAME}

[npm-downloads.svg]: https://img.shields.io/npm/dm/${NAME}.svg
[npm.link]: https://www.npmjs.com/package/${NAME}
[npm-version.svg]: https://img.shields.io/npm/v/${NAME}.svg

[dm-david.svg]: https://david-dm.org/${USER}/${NAME}.svg
[dm-david.link]: https://david-dm.org/${USER}/${NAME}
`);
