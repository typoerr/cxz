import test from 'ava'
import { css, keyframes, reset, extract } from '../src/index'

test.serial.beforeEach(reset)

test.serial('css', (t) => {
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

  t.is(extract(), `@media{${a + b + c + d}}`)
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

  t.is(extract(), `@keyframes ${name}{from{opacity:0;}to{opacity:1;}}`)
})
