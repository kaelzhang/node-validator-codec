[![Build Status](https://travis-ci.org/kaelzhang/node-validator-codec.svg?branch=master)](https://travis-ci.org/kaelzhang/node-validator-codec)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-validator-codec?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-validator-codec)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/validator-codec.svg)](http://badge.fury.io/js/validator-codec)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/validator-codec.svg)](https://www.npmjs.org/package/validator-codec)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-validator-codec.svg)](https://david-dm.org/kaelzhang/node-validator-codec)
-->

# validator-codec

Codec for validator presets

## Install

```sh
$ npm install validator-codec --save
```

## Usage

```js
const codec = require('validator-codec')
const presets = {
  username: v => v !== 'steve',
  'min-length': (v, min) => v.length >= min,
  'username-min-length': ['username', 'min-length:3']
}

codec('username', presets).every(validator => validator('steve'))  // false

// 1. More than one rules split with `|`
// 2. Rule name and arguments split with `:`
codec('min-length:3|username')
```

### codec(rule, presets [, list])

Analysis the `rule` according to `presets`, and generates the array list of testers, or append to the existing `list`(if `list` argument is provided)

- **list** `Array=[]` optional, defaults to `[]`
- **presets** `Object`
- **rule**
  - `String` will be parsed according to `presets`,
  - `function(v)` will be added to `list`
  - `RegExp` will be transformed into a function

Returns `Array.<function>`

## License

MIT
