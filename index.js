/* jshint node: true, esversion: 6 */

var _ = require('lodash');
var argv = require('yargs').argv;

// because why not
var badgesString = `
[![Build][1]][2]
[![Test Coverage][3]][4]
[![Code Climate][5]][6]
[![Downloads][7]][8]
[![Version][9]][8]
[![Dependency Status][10]][11]

[1]: https://travis-ci.org/catdad/{{name}}.svg?branch=master
[2]: https://travis-ci.org/catdad/{{name}}

[3]: https://codeclimate.com/github/catdad/{{name}}/badges/coverage.svg
[4]: https://codeclimate.com/github/catdad/{{name}}/coverage

[5]: https://codeclimate.com/github/{{user}}/{{name}}/badges/gpa.svg
[6]: https://codeclimate.com/github/{{user}}/{{name}}

[7]: https://img.shields.io/npm/dm/{{name}}.svg
[8]: https://www.npmjs.com/package/{{name}}
[9]: https://img.shields.io/npm/v/{{name}}.svg

[10]: https://david-dm.org/{{user}}/{{name}}.svg
[11]: https://david-dm.org/{{user}}/{{name}}
`;

_.templateSettings = {
    evaluate : /\{\[([\s\S]+?)\]\}/g,
    interpolate : /\{\{([\s\S]+?)\}\}/g
};

var template = _.template(badgesString);

var pkg = {};

try {
    pkg = require('./package.json');
} catch(e) {
}

var USER = process.env.USER || argv.user || 'catdad';
var NAME = process.env.NAME || argv.name || pkg.name;

console.log(template({
    name: NAME,
    user: USER
}));
