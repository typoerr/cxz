import * as CSS from 'csstype'
import hash from '@emotion/hash'

export interface CSSProps extends CSS.Properties, CSS.PropertiesHyphen {}

export type CSSTree = CSSProps | Record<string, CSSProps> | Record<string, Record<string, CSSProps>>

export interface KeyFrameTree extends Record<string, CSSProps> {}

export type CSSFunction = (tree: CSSTree) => string

const hyph = (s: string) => s.replace(/[A-Z]/g, '-$&').toLowerCase()

const wrap = (k: string, v: string) => k + '{' + v + '}'

const pair = (k: string, v: string) => hyph(k) + ':' + v + ';'

export let _cache: Record<string, string> = {}

export const _rules: string[] = []

const _prefix = 'cxz'

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

export const sel = (s: string) => '.' + s.split(' ')[0]

export const css: CSSFunction = function patch(tree: CSSTree, pseudo: string = '', media?: string) {
  const cNames: string[] = []
  for (const prop in tree) {
    const val: any = tree[prop as keyof CSSTree]
    if (typeof val === 'object') {
      cNames.push(patch.apply(null, prop[0] === '@' ? [val, pseudo, prop] : [val, prop, media]))
    } else {
      const ck = prop + val + pseudo + media
      if (_cache[ck]) {
        cNames.push(_cache[ck])
      } else {
        const cn = (_cache[ck] = _prefix + '-' + hash(ck))
        cNames.push(cn)
        const sel = pseudo ? pseudo.replace(/&/g, '.' + cn) : '.' + cn
        const rule = wrap(sel, pair(prop, val))
        insert(media ? wrap(media, rule) : rule)
      }
    }
  }
  return cNames.join(' ')
}

export const keyframes = (tree: KeyFrameTree) => {
  let rule = ''
  for (const key in tree) {
    const props = tree[key]
    let s = ''
    for (const prop in props) {
      const val: any = props[prop as keyof CSSProps]
      s += pair(prop, val)
    }
    rule += wrap(key, s)
  }

  if (_cache[rule]) {
    return _cache[rule]
  } else {
    const name = (_cache[rule] = _prefix + '-' + hash(rule))
    insert(wrap('@keyframes ' + name, rule))
    return name
  }
}

export const extract = () => _rules.join('')

export const reset = () => {
  _cache = {}
  while (_rules.length) _rules.pop()
}
