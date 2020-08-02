import { h, render } from 'preact'
import { css, sel, keyframes } from '../src/index'

const effect = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const text = css({
  textAlign: 'center',
  color: 'gray',
})

const container = css({
  animation: `${effect} 1000ms`,
  width: '300px',
  height: '100px',
  background: 'pink',
  [`&:hover > ${sel(text)}`]: {
    color: 'green',
  },
  '@media(min-width:500px)': {
    background: 'yellow',
  },
})

document.addEventListener('DOMContentLoaded', () => {
  const view = h('div', { class: container }, [h('p', { class: text }, 'Hello world')])
  render(view, document.getElementById('root')!)
})
