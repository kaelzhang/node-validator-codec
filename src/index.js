module.exports = codec

const util = require('util')

function codec (rule, presets, host = []) {
  if (typeof rule !== 'string') {
    host.push(wrap(rule))
    return host
  }

  rule.split('|')
  .map(tester => {
    tester = tester.trim()
    if (!tester) {
      return false
    }

    const index = tester.indexOf(':')
    if (!~index) {
      return {
        name: tester,
        args: []
      }
    }

    const name = tester.slice(0, index).trim()
    const args = tester.slice(index + 1)
    .split(',')
    .map(arg => arg.trim())

    return {
      name,
      args
    }
  })
  .forEach(({name, args}) => {
    const preset = presets[name]
    if (!preset) {
      throw new Error(`validator-codec: unknown preset "${name}"`)
    }

    if (typeof preset === 'function') {
      host.push(wrapWithArgs(name, preset, args))
    }

    if (util.isArray(preset)) {
      preset.forEach(rule => codec(rule, presets, host))
    }
  })

  return host
}


function wrap (rule) {
  if (typeof rule === 'function') {
    return rule
  }

  if (util.isRegExp(rule)) {
    return v => rule.test(v)
  }

  throw new Error(`validator-codec: invalid rule "${rule}"`)
}


function wrapWithArgs (name, method, args) {
  // The first argument is the value
  const expectedArgLength = method.length - 1

  if (expectedArgLength !== args.length) {
    const message = expectedArgLength === 1
      ? `one argument`
      : `${argLength} arguments.`

    throw new Error(
      `value-validator: preset "${name}" only accepts ${message}`
    )
  }

  return function (v) {
    return method.apply(this, [v, ...args])
  }
}
