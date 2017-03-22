const test = require('ava')
const codec = require('..')

const presets = {
  'min-length': (v, min) => {
    return v.length >= Number(min)
  },

  'max-length': (v, max) => {
    return v.length <= Number(max)
  },

  mobile: /1\d{10}/,

  username: function (v) {
    return v !== 'steve'
  },

  between: (v, min, max) => {
    return v.length >= Number(min) && v.length <= Number(max)
  },

  'min-length-4-username': [
    'min-length:4',
    'username'
  ]
}

;[
  [,,null,,,true],
  [,,undefined,,,true],
  [,,x => x > 1, 2, true],
  [,,/^[a-z]+$/, '32', false],
  [,,'min-length:2,3',,,true],
  [,,'min-length:2', 'a', false],
  [,,'min-length:2|max-length:5', 'aaa', true],
  [,,'min-length:2|max-length:5', 'aaaaaa', false],
  ['regexp',,'mobile','18800001111', true],
  ['set of preset',,'min-length-4-username','kael',true],
  ['set of preset',,'min-length-4-username','steve',false]

].forEach((c) => {
  const [d = '', only, r, v, pass, throws] = c
  c.shift()

  const _test = only
    ? test.only
    : test

  _test(d + JSON.stringify(c), t => {
    if (throws) {
      t.throws(() => {
        codec(r, presets)
      }, Error)

      return
    }

    const result = codec(r, presets).every((tester) => {
      return tester(v)
    })

    t.is(result, pass)
  })
})
