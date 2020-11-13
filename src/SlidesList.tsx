import React, { useEffect, useState } from 'react'
import { SlideEditor } from './SlideEditor'
import { Slide } from './types'

const saveSlidesInLocalStorage = (slides: any) => {
  localStorage.setItem('slides', JSON.stringify(slides))
}

const getSlidesFromLocalStorage = () => {
  const json = localStorage.getItem('slides')
  return json && JSON.parse(json)
}

export const SlidesList = () => {
  const [editMode, setEditMode] = useState(true)
  const [slides, setSlides] = useState<Array<Slide>>([])
  const [currentSlide, setCurrentSlide] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    const savedSlides = getSlidesFromLocalStorage()
    const slides =
      savedSlides && savedSlides.length > 0
        ? savedSlides
        : [{ id: '0', elements: [] }]
    setSlides(slides)
    setCurrentSlide(slides[0].id)
  }, [])

  const getSlide = (id: string) => slides.find((s) => s.id === id)
  const updateSlide = (id: string, elements: any[]) => {
    const newSlides = slides.map((slide) =>
      slide.id === id ? { ...slide, elements } : slide
    )
    setSlides(newSlides)
    saveSlidesInLocalStorage(newSlides)
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
    if (!isLastSlide) changeCurrentSlide(slides[slideIndex + 1].id)
  }
  const goToPreviousSlide = () => {
    if (!isFirstSlide) changeCurrentSlide(slides[slideIndex - 1].id)
  }

  const toggleEditMode = () => {
    setEditMode((e) => !e)
    changeCurrentSlide(currentSlide!)
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (editMode) return
    switch (event.key) {
      case 'ArrowRight':
        goToNextSlide()
        break
      case 'ArrowLeft':
        goToPreviousSlide()
        break
      case 'Escape':
        toggleEditMode()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeydown, true)
    return () => window.removeEventListener('keydown', onKeydown, true)
  }, [onKeydown])

  return slides.length > 0 ? (
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
            <button className="button" onClick={addSlide}>
              +
            </button>
          </li>
        </ul>
      )}
      <ul className="toolbar">
        <li>
          <button className="button" onClick={toggleEditMode}>
            {editMode ? '▶' : '✎'}
          </button>
        </li>
        <li>
          <button
            className="button"
            disabled={isFirstSlide}
            onClick={goToPreviousSlide}
          >
            ←
          </button>
        </li>
        <li>
          <button
            className="button"
            disabled={isLastSlide}
            onClick={goToNextSlide}
          >
            →
          </button>
        </li>
      </ul>
      {!editMode && <div className="overlay"></div>}
      {currentSlide !== undefined && (
        <SlideEditor
          editMode={editMode}
          slide={getSlide(currentSlide)!}
          onSlideChange={(elements) => updateSlide(currentSlide, elements)}
        />
      )}
    </>
  ) : null
}
