import test from 'ava'
import { css, keyframes, sheet } from '../src/index'

test.beforeEach(() => {
  sheet.reset()
})

test.serial('css', (t) => {
  const name = css({
    color: 'red',
    '&:hover': { color: 'yellow' },
    backgroundColor: 'blue',
    '@media(min-width:500px)': {
      color: 'red',
      '&:hover': { color: 'yellow' },
      backgroundColor: 'blue',
    },
  })

  const rules = [
    '/*cxz*/',
    '.cxz-bkhmwp{color:red;}',
    '.cxz-zbx9te:hover{color:yellow;}',
    '.cxz-1t2ai63{background-color:blue;}',
    '@media(min-width:500px){.cxz-ysyzqw{color:red;}}',
    '@media(min-width:500px){.cxz-1vki4xt:hover{color:yellow;}}',
    '@media(min-width:500px){.cxz-19wsgt3{background-color:blue;}}',
  ]

  t.is(name, 'cxz-bkhmwp cxz-zbx9te cxz-1t2ai63 cxz-ysyzqw cxz-1vki4xt cxz-19wsgt3')
  t.is(sheet.extract(), rules.join(''))
})

test.serial('keyframes', (t) => {
  const name = keyframes({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  })

  t.is(sheet.extract(), `/*cxz*/@keyframes ${name}{from{opacity:0;}to{opacity:1;}}`)
})
