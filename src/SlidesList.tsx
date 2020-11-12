import React, { useState } from 'react'
import { SlideEditor } from './SlideEditor'

export const SlidesList = () => {
  const [editMode, setEditMode] = useState(true)
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

  const slideIndex = slides.findIndex((s) => s.id === currentSlide)
  const isFirstSlide = slideIndex === 0
  const isLastSlide = slideIndex === slides.length - 1

  const goToNextSlide = () => {
    setCurrentSlide(slides[slideIndex + 1].id)
  }
  const goToPreviousSlide = () => {
    setCurrentSlide(slides[slideIndex - 1].id)
  }

  return (
    <>
      {editMode && (
        <ul className="slides-list">
          {slides.map((slide, index) => (
            <li key={slide.id}>
              <button
                className={
                  'button' + (slide.id === currentSlide ? ' active' : '')
                }
                onClick={() => changeCurrentSlide(slide.id)}
              >
                Slide #{index + 1}
              </button>
            </li>
          ))}
          <li>
            <button className="button" onClick={() => addSlide()}>
              +
            </button>
          </li>
        </ul>
      )}
      <ul className="toolbar">
        <li>
          <button className="button" onClick={() => setEditMode((e) => !e)}>
            {editMode ? 'Present' : 'Edit'}
          </button>
        </li>
        <li>
          <button
            className="button"
            disabled={isFirstSlide}
            onClick={goToPreviousSlide}
          >
            Previous
          </button>
        </li>
        <li>
          <button
            className="button"
            disabled={isLastSlide}
            onClick={goToNextSlide}
          >
            Next
          </button>
        </li>
      </ul>
      {currentSlide !== undefined && (
        <SlideEditor
          editMode={editMode}
          slide={getSlide(currentSlide)}
          onSlideChange={(elements) => updateSlide(currentSlide, elements)}
        />
      )}
    </>
  )
}
