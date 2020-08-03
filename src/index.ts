import * as CSS from 'csstype'
import hash from '@emotion/hash'

export interface CSSProps extends CSS.Properties, CSS.PropertiesHyphen {}

export type CSSTree = CSSProps | Record<string, CSSProps> | Record<string, Record<string, CSSProps>>

export interface KeyFrameTree extends Record<string, CSSProps> {}

const hyph = (s: string) => s.replace(/[A-Z]/g, '-$&').toLowerCase()
const wrap = (k: string, v: string) => k + '{' + v + '}'
const pair = (k: string, v: string) => hyph(k) + ':' + v + ';'

const _prefix = 'cxz'
const _rules: string[] = []
let _cache: Record<string, string> = {}

let insert = (rule: string): unknown => _rules.push(rule)

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.id = '_' + _prefix
  const sheet = document.head.appendChild(style).sheet!
  insert = (rule) => {
    sheet.insertRule(rule, sheet.cssRules.length)
    _rules.push(rule)
  }
}

function compile(tree: CSSTree, sel = '&') {
  let rules = ''
  let block = ''
  for (const prop in tree) {
    const val: any = tree[prop as keyof CSSTree]
    if (val == null) {
      continue
    } else if (typeof val === 'object') {
      if (block.length) {
        rules += wrap(sel, block)
        block = ''
      }
      if (prop[0] === '@') {
        rules += wrap(prop, compile(val, sel))
      } else {
        rules += compile(val, prop)
      }
    } else {
      block += pair(prop, val)
    }
  }
  if (block.length) {
    rules += wrap(sel, block)
  }
  return rules
}

export function css(tree: CSSTree) {
  const rule = compile(tree)
  if (_cache[rule]) {
    return _cache[rule]
  }
  const name = (_cache[rule] = _prefix + '_' + hash(rule))
  insert(wrap('@media', rule.replace(/&/gm, '.' + name)))
  return name
}

export function keyframes(tree: KeyFrameTree) {
  const rule = compile(tree)
  if (_cache[rule]) {
    return _cache[rule]
  }
  const name = (_cache[rule] = _prefix + '_' + hash(rule))
  insert(wrap('@keyframes ' + name, rule))
  return name
}

export function extract() {
  return _rules.join('')
}

export function reset() {
  _cache = {}
  while (_rules.length) _rules.pop()
}
