import * as CSS from 'csstype'
import hash from '@emotion/hash'

export interface CSSProps extends CSS.Properties, CSS.PropertiesHyphen {}

export type CSSTree = CSSProps | Record<string, CSSProps> | Record<string, Record<string, CSSProps>>

export interface CXZOption {
  prefix?: string
}

const hyph = (s: string) => s.replace(/[A-Z]/g, '-$&').toLowerCase()
const wrap = (k: string, v: string) => k + '{' + v + '}'
const pair = (k: string, v: string) => k + ':' + v + ';'

const compile = (tree: CSSTree, sel = '&') => {
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
      block += pair(hyph(prop), val)
    }
  }
  if (block.length) {
    rules += wrap(sel, block)
  }
  return rules
}

export default function cxz(option: CXZOption = {}) {
  const prefix = option.prefix || 'cxz'
  let cache: Record<string, string> = {}

  const sheet = (() => {
    let _sheet = { data: '' }
    if (typeof document !== 'undefined') {
      const id = '_' + prefix
      const style = document.getElementById(id) || document.head.appendChild(document.createElement('style'))
      style.id = id
      style.innerHTML = ' '
      _sheet = style.firstChild as any
    }
    const insert = (rule: string) => _sheet.data.indexOf(rule) < 0 && (_sheet.data += rule)
    const reset = () => (cache = {}) && (_sheet.data = ' ')
    const extract = () => _sheet.data
    return { insert, reset, extract }
  })()

  const create = (cb: (rule: string, name: string) => string) => (tree: CSSTree) => {
    const rule = compile(tree)
    if (cache[rule]) {
      return cache[rule]
    }
    const name = (cache[rule] = prefix + '-' + hash(rule))
    sheet.insert(cb(rule, name))
    return name
  }

  const css = create((rule, name) => rule.replace(/&/gm, '.' + name))
  const keyframes = create((rule, name) => wrap('@keyframes ' + name, rule))

  return { sheet, css, keyframes }
}

export const { css, keyframes, sheet } = cxz()
