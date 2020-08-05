import * as CSS from 'csstype'

export interface CSSProps extends CSS.Properties, CSS.PropertiesHyphen {}

export type CSSTree = CSSProps | Record<string, CSSProps> | Record<string, Record<string, CSSProps>>

export interface CXZOption {
  prefix?: string
}

const hyph = (s: string) => s.replace(/[A-Z]/g, '-$&').toLowerCase()
const wrap = (k: string, v: string) => k + '{' + v + '}'
const pair = (k: string, v: string) => k + ':' + v + ';'

const compile = (tree: CSSTree, sel = '&') => {
  let rule = ''
  let block = ''
  for (const k in tree) {
    const v: any = tree[k as keyof CSSTree]
    if (v == null) {
      continue
    } else if (typeof v === 'object') {
      if (block) {
        rule += wrap(sel, block)
        block = ''
      }
      if (k[0] === '@') {
        rule += wrap(k, compile(v, sel))
      } else {
        rule += compile(v, k)
      }
    } else {
      block += pair(hyph(k), v)
    }
  }
  if (block) {
    rule += wrap(sel, block)
  }
  return rule
}

export default function cxz(option: CXZOption = {}) {
  let id = 0
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

  const gen = (cb: (rule: string, name: string) => string) => (tree: CSSTree) => {
    const rule = compile(tree)
    if (cache[rule]) {
      return cache[rule]
    }
    const name = (cache[rule] = prefix + '-' + id++)
    sheet.insert(cb(rule, name))
    return name
  }

  const css = gen((rule, name) => rule.replace(/&/gm, '.' + name))
  const keyframes = gen((rule, name) => wrap('@keyframes ' + name, rule))

  return { sheet, css, keyframes }
}

export const { css, keyframes, sheet } = cxz()
