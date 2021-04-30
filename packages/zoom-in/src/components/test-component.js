import Image from './zoomable-image'
import React from 'react'
import defaultTheme from '../themes/default-theme'
import styled from 'styled-components'
import twreporterTheme from '../themes/twreporter-theme'

const Article = styled.article`
  width: 40%;
  margin: 0 auto;
`

function TestComponent() {
  return (
    <Article>
      <h1>zoom-in demo</h1>
      <Image
        src="https://images.unsplash.com/photo-1433477077279-9354d2d72f6b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1965&q=80"
        alt="Zoom 1"
        theme={defaultTheme}
      />
      <figcaption>
        photo by{' '}
        <a href="https://unsplash.com/photos/1fUu0dratoM">Jasper Boer</a> on{' '}
        <a href="https://unsplash.com/">Unsplash</a>
      </figcaption>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora
        praesentium cupiditate fugit voluptas, rem eligendi, voluptatem
        molestias. Doloremque sit voluptatum odio maiores provident consequuntur
        accusantium saepe.
      </p>
      <Image
        src="https://images.unsplash.com/photo-1560335215-4eff7c45254b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1965&q=80"
        alt="Zoom 1"
        caption="數年前在美國使用VRS手語視訊翻譯平台（Video Relay Service）後，難忘如此振奮的感覺，歐陽磊回台便創立洛以，全體員工都是聽障者。"
        theme={twreporterTheme}
      />
      <figcaption>
        photo by{' '}
        <a href="https://unsplash.com/photos/Mv6lwDGnGe8">Pavel Nekoranec</a> on{' '}
        <a href="https://unsplash.com/">Unsplash</a>
      </figcaption>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora
        praesentium cupiditate fugit voluptas, rem eligendi, voluptatem
        molestias. Doloremque sit voluptatum odio maiores provident consequuntur
        accusantium saepe.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea dolores
        quaerat, quis modi nostrum sequi adipisci ratione esse blanditiis error
        beatae vel non vero dolor nemo. Animi nemo quisquam ducimus!
      </p>
      <Image
        src="https://images.unsplash.com/photo-1599651007554-1217f1725b7b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1789&q=80"
        alt="Zoom 1"
        caption="數年前在美國使用VRS手語視訊翻譯平台（Video Relay Service）後，難忘如此振奮的感覺，歐陽磊回台便創立洛以，全體員工都是聽障者。（攝影／張家瑋）"
        theme={twreporterTheme}
      />
      <figcaption>
        photo by{' '}
        <a href="https://unsplash.com/photos/X6rdHDWmoH4">Niels van Altena</a>{' '}
        on <a href="https://unsplash.com/">Unsplash</a>
      </figcaption>
    </Article>
  )
}

export default TestComponent
