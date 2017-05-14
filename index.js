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

var USER = argv.user || process.env.USER;
var NAME = argv.name || process.env.NAME || pkg.name;

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

var regex = /this is a regex/;

var badges = {
  travis: {
    svg: `https://travis-ci.org/${USER}/${NAME}.svg?branch=master`,
    link: `https://travis-ci.org/${USER}/${NAME}`
  },
  appveyor: {
    svg: `https://ci.appveyor.com/api/projects/status/github/${USER}/${NAME}?branch=master&svg=true`,
    link: `https://ci.appveyor.com/project/${USER}/${NAME}`
  },
  'cov-codeclimate': {
    svg: `https://codeclimate.com/github/${USER}/${NAME}/badges/coverage.svg`,
    link: `https://codeclimate.com/github/${USER}/${NAME}/coverage`
  },
  'cov-coveralls': {
    svg: `https://img.shields.io/coveralls/${USER}/${NAME}.svg`,
    link: `https://coveralls.io/github/${USER}/${NAME}?branch=master`
  },
  'score-codeclimate': {
    svg: `https://codeclimate.com/github/${USER}/${NAME}/badges/gpa.svg`,
    link: `https://codeclimate.com/github/${USER}/${NAME}`
  },
  'score-bithound': {
    svg: `https://www.bithound.io/github/${USER}/${NAME}/badges/score.svg`,
    link: `https://www.bithound.io/github/${USER}/${NAME}`
  },
  'npm-downloads': {
    svg: `https://img.shields.io/npm/dm/${NAME}.svg`,
    link: ['npm', `https://www.npmjs.com/package/${NAME}`]
  },
  'npm-version': {
    svg: `https://img.shields.io/npm/v/${NAME}.svg`,
    link: ['npm', `https://www.npmjs.com/package/${NAME}`]
  },
  'dm-david': {
    svg: `https://david-dm.org/${USER}/${NAME}.svg`,
    link: `https://david-dm.org/${USER}/${NAME}`
  }
};

function getLink(name, type, val) {
  if (Array.isArray(val)) {
    return { name: `${val[0]}.${type}`, val: val[1] };
  }

  return getLink(null, type, [name, val]);
}

function serializeBadge(name, svg, link) {
  return `[![${name}][${svg.name}]][${link.name}]`;
}

function serializeLink(link) {
  return `[${link.name}]: ${link.val}`;
}

function buildLinks(badges) {
  return Object.keys(badges).reduce((memo, name) => {
    var val = badges[name];

    var svg = getLink(name, 'svg', val.svg);
    var link = getLink(name, 'link', val.link);

    memo.badges.add(serializeBadge(name, svg, link));
    memo.list.add(serializeLink(svg));
    memo.list.add(serializeLink(link));

    return memo;
  }, {
    badges: new Set(),
    list: new Set()
  });
}

function serializeLinksList(links) {
  return Array.from(links.badges).join('\n') + '\n\n' + Array.from(links.list).join('\n');
}

// because why not
console.log(serializeLinksList(buildLinks(badges)));
