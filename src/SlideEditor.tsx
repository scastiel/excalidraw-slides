import React, { useEffect, useState } from 'react'
import Excalidraw from 'excalidraw'
import 'excalidraw/dist/excalidraw.min.css'
import { Slide } from './types'

export interface Props {
  slide: Slide
  editMode: boolean
  onSlideChange: (elements: any[]) => void
}

export const SlideEditor = ({ slide, editMode, onSlideChange }: Props) => {
  const onChange = (elements: any[]) => {
    if (JSON.stringify(elements) !== JSON.stringify(slide.elements)) {
      onSlideChange(elements)
    }
  }

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const onResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {!editMode && (
        <style>{`
        .excalidraw .App-menu,
          footer.layer-ui__wrapper__footer {
          display: none
        }
        `}</style>
      )}
      <style>
        {`
          .excalidraw .App-menu_top > *:first-child > *:first-child {
            display: none
          }
        `}
      </style>
      <Excalidraw
        width={dimensions.width}
        height={dimensions.height}
        initialData={slide.elements}
        onChange={onChange}
      />
    </div>
  )
}
