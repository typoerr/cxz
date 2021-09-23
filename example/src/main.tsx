import React from 'react'
import { render } from 'react-dom'
import { css, keyframes, sheet } from './../../src'

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
  margin: 'auto',
  width: '800px',
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
    <div className={container}>
      <h1 data-role="title" className={title}>
        Hello World!!!
      </h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus, perferendis! Quibusdam autem veniam
        maiores voluptates natus sint, dolores magni facere voluptate. Totam corporis ut aliquid vero. Perspiciatis sunt
        repellat cumque deserunt animi, quidem voluptatibus est suscipit impedit ullam vitae, dolores tempore illum
        incidunt itaque corrupti similique odit quisquam. Ut quos vitae nisi, quia ipsa, dicta in odio officiis quae sed
        deserunt eveniet, cumque provident distinctio dignissimos adipisci! Unde officia sequi soluta odit nobis est, a
        impedit inventore beatae omnis tempore numquam cupiditate blanditiis ipsa provident eos maxime quod repellat
        vitae accusamus officiis ipsam hic eum. Totam harum rerum dicta neque, a blanditiis velit nihil sed voluptate
        facilis doloremque impedit quasi, molestiae quam earum tenetur, eum suscipit enim cum? Nulla facilis quis totam
        neque saepe earum dolor cum vel incidunt suscipit aperiam asperiores, omnis maiores eligendi officiis dolorum
        velit optio quidem nostrum exercitationem. Vitae, aspernatur? Consequuntur perspiciatis quaerat, amet temporibus
        sunt tenetur eius nihil sit ea quas aut qui ullam voluptates? Corrupti nulla aliquid suscipit rem necessitatibus
        iste possimus culpa! Accusamus cum in numquam expedita id, nostrum veniam vero ducimus voluptate nihil,
        praesentium qui. Similique minima accusamus vitae, delectus ab aliquam. Esse totam accusamus adipisci illo
        laudantium reiciendis exercitationem molestias deserunt!
      </p>
      <button type="button" onClick={sheet.reset}>
        reset stylesheet
      </button>
    </div>
  )
  render(view, document.getElementById('root')!)
})
