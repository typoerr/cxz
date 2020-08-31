import * as CSS from 'csstype'
import ehash from '@emotion/hash'

export interface CSSProps extends CSS.Properties, CSS.PropertiesHyphen {}

export type CSSTree = CSSProps | Record<string, CSSProps> | Record<string, Record<string, CSSProps>>

const prefix = 'cxz'

const marker = '/*' + prefix + '*/'

const hyph = (s: string) => s.replace(/[A-Z]/g, '-$&').toLowerCase()

const wrapper = (acc: string, k: string | undefined) => (k ? k + '{' + acc + '}' : acc)

const wrap = (v: string, ...path: (string | undefined)[]) => path.reduce(wrapper, v)

const pair = (k: string, v: string) => k + ':' + v + ';'

const hash = (rule: string) => prefix + '-' + ehash(rule)

function stringify(obj: Record<string, any>, ret = ''): string {
  for (const k in obj) {
    const v = obj[k]
    ret += typeof v === 'object' ? wrap(stringify(v), k) : pair(hyph(k), v)
  }
  return ret
}

let cache: Record<string, string> = {}

export const sheet = (function (s: { data: string }) {
  if (typeof document !== 'undefined') {
    const style = document.head.appendChild(document.createElement('style'))
    style.dataset[prefix] = prefix
    s = style.appendChild(document.createTextNode(marker))
  }
  return {
    insert: (rule: string) => (s.data += rule),
    reset: () => (s.data = marker) && (cache = {}),
    extract: () => s.data,
  }
})({ data: marker })

export function patch(tree: CSSTree, sel = '&', at?: string) {
  const cx = [hash(stringify(tree))]

  for (const k in tree) {
    const v: any = tree[k as keyof CSSTree]
    if (typeof v === 'object') {
      cx.push(k[0] === '@' ? patch(v, sel, k) : patch(v, k, at))
    } else {
      const rule = wrap(pair(hyph(k), v), sel, at)
      if (cache[rule]) {
        cx.push(cache[rule])
      } else {
        const name = (cache[rule] = hash(rule))
        sheet.insert(rule.replace(/&/gm, '.' + name))
        cx.push(name)
      }
    }
  }

  return cx.join(' ')
}

export function css(tree: CSSTree) {
  return patch(tree)
}

export function keyframes(tree: CSSTree) {
  const rule = stringify(tree)
  if (cache[rule]) return cache[rule]
  const name = (cache[rule] = hash(rule))
  sheet.insert(wrap(rule, '@keyframes ' + name))
  return name
}

export function sel(clazz: string) {
  return '.' + clazz.split(' ')[0]
}
