import test from 'ava'
import cxz from '../src/index'

test('css', (t) => {
  const { css, sheet } = cxz()

  const name = css({
    color: 'red',
    '&:hover': {
      color: 'yellow',
    },
    backgroundColor: 'blue',
    '@media(min-width:500px)': {
      color: 'red',
      '&:hover': {
        color: 'yellow',
      },
      backgroundColor: 'blue',
    },
  })

  const a = `.${name}{color:red;}`
  const b = `.${name}:hover{color:yellow;}`
  const c = `.${name}{background-color:blue;}`
  const d = `@media(min-width:500px){${a + b + c}}`

  t.is(sheet.extract(), a + b + c + d)
})

test('keyframes', (t) => {
  const { keyframes, sheet } = cxz()
  const name = keyframes({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  })

  t.is(sheet.extract(), `@keyframes ${name}{from{opacity:0;}to{opacity:1;}}`)
})
