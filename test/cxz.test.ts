import test from 'ava'
import { css, keyframes, extract, reset, sel, _rules, _cache } from '../src/cxz'

test.serial.beforeEach(reset)

test.serial('css', (t) => {
  const classNames = css({
    color: 'black',
    '&:hover': {
      color: 'green',
    },
    '@media(min-width:500px)': {
      color: 'yellow',
      '&:hover': {
        color: 'blue',
      },
    },
  })

  t.is(classNames, 'cxz-xsykfc cxz-ntp3no cxz-1nwl7hb cxz-t132yo')

  t.deepEqual(_cache, {
    colorblackundefined: 'cxz-xsykfc',
    'colorgreen&:hoverundefined': 'cxz-ntp3no',
    'coloryellow@media(min-width:500px)': 'cxz-1nwl7hb',
    'colorblue&:hover@media(min-width:500px)': 'cxz-t132yo',
  })

  const rules = [
    '.cxz-xsykfc{color:black;}',
    '.cxz-ntp3no:hover{color:green;}',
    '@media(min-width:500px){.cxz-1nwl7hb{color:yellow;}}',
    '@media(min-width:500px){.cxz-t132yo:hover{color:blue;}}',
  ]

  t.deepEqual(_rules, rules)

  t.is(extract(), rules.join(''))
})

test('keyframes', (t) => {
  const name = keyframes({
    from: { opacity: 1 },
    to: { opacity: 0 },
  })

  t.is(name, 'cxz-k0lfw7')
  t.deepEqual(_rules, ['@keyframes cxz-k0lfw7{from{opacity:1;}to{opacity:0;}}'])
  t.deepEqual(_cache, { 'from{opacity:1;}to{opacity:0;}': 'cxz-k0lfw7' })
  t.is(extract(), '@keyframes cxz-k0lfw7{from{opacity:1;}to{opacity:0;}}')
})

test.serial('extract', (t) => {
  css({ color: 'black' })
  t.is(extract(), '.cxz-xsykfc{color:black;}')
})

test.serial('reset', (t) => {
  t.deepEqual(_cache, {})
  t.deepEqual(_rules, [])

  css({ color: 'black' })

  t.is(Object.keys(_cache).length, 1)
  t.is(_rules.length, 1)

  reset()

  t.deepEqual(_cache, {})
  t.deepEqual(_rules, [])
})

test('sel', (t) => {
  const classNames = css({
    color: 'black',
    fontSize: 'large',
  })
  t.is(sel(classNames), '.cxz-xsykfc')
})
