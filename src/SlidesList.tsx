import React, { useState } from 'react'
import { SlideEditor } from './SlideEditor'

export const SlidesList = () => {
  const [slides, setSlides] = useState([{ id: '0', elements: [] }])
  const [currentSlide, setCurrentSlide] = useState('0')

  const getSlide = (id: string) => slides.find((s) => s.id === id)
  const updateSlide = (id: string, elements: any[]) => {
    console.log('updating', id)
    setSlides((slides) =>
      slides.map((slide) => (slide.id === id ? { ...slide, elements } : slide))
    )
  }

  const changeCurrentSlide = (id: string) => {
    setCurrentSlide(undefined)
    setTimeout(() => setCurrentSlide(id), 10)
  }

  const addSlide = () => {
    setSlides((slides) => [
      ...slides,
      { id: String(Math.random()), elements: [] },
    ])
  }

  return (
    <>
      <ul className="slides-list">
        {slides.map((slide, index) => (
          <li key={slide.id}>
            <div
              role="button"
              className={
                'slide-button' + (slide.id === currentSlide ? ' active' : '')
              }
              onClick={() => changeCurrentSlide(slide.id)}
            >
              Slide #{index + 1}
            </div>
          </li>
        ))}
        <li>
          <div
            role="button"
            className="slide-button"
            onClick={() => addSlide()}
          >
            +
          </div>
        </li>
      </ul>
      {currentSlide !== undefined && (
        <SlideEditor
          slide={getSlide(currentSlide)}
          onSlideChange={(elements) => updateSlide(currentSlide, elements)}
        />
      )}
    </>
  )
}
