import { h, render, Fragment } from 'preact'
import { css, keyframes, sheet } from '../src/index'

const effect = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const title = css({
  textAlign: 'center',
  color: 'gray',
  borderBottom: 'solid 1px pink',
})

const container = css({
  animation: `${effect} 1000ms ease-out`,
  background: 'pink',
  padding: '10px',
  '&:hover > [data-role="title"]': {
    color: 'red',
  },
  '@media(min-width:500px)': {
    background: 'yellow',
  },
})

document.addEventListener('DOMContentLoaded', () => {
  const view = (
    <Fragment>
      <div class={container}>
        <h1 data-role="title" class={title}>
          Hello World
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur laudantium corrupti soluta dolorem adipisci,
          ut mollitia aperiam quasi nulla eveniet nisi optio quos dolore dignissimos modi eos eum numquam consequatur.
        </p>
      </div>
      <button type="button" onClick={sheet.reset}>
        reset
      </button>
    </Fragment>
  )
  render(view, document.getElementById('root')!)
})
