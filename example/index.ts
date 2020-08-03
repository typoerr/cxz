import { h, render } from 'preact'
import { css, keyframes } from '../src/index'

const effect = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const text = css({
  textAlign: 'center',
  color: 'gray',
  borderBottom: 'solid 1px pink',
})

const container = css({
  animation: `${effect} 1000ms`,
  width: '300px',
  height: '100px',
  background: 'pink',
  [`&:hover > .${text}`]: {
    color: 'green',
    borderBottom: 'solid 1px #aaa',
  },
  '@media(min-width:500px)': {
    background: 'yellow',
  },
})

document.addEventListener('DOMContentLoaded', () => {
  const view = h('div', { class: container }, [h('p', { class: text }, 'Hello world')])
  render(view, document.getElementById('root')!)
})
