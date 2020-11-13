import React, { useEffect, useState } from 'react'
import { ExportIcon, ImportIcon } from './icons'
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

  const updateSlides = (slides: Slide[]) => {
    setSlides(slides)
    saveSlidesInLocalStorage(slides)
  }

  useEffect(() => {
    const savedSlides = getSlidesFromLocalStorage()
    const slides =
      savedSlides && savedSlides.length > 0
        ? savedSlides
        : [{ id: '0', elements: [] }]
    updateSlides(slides)
    setCurrentSlide(slides[0].id)
  }, [])

  const getSlide = (id: string) => slides.find((s) => s.id === id)
  const updateSlide = (id: string, elements: any[]) => {
    const newSlides = slides.map((slide) =>
      slide.id === id ? { ...slide, elements } : slide
    )
    updateSlides(newSlides)
  }

  const changeCurrentSlide = (id: string) => {
    setCurrentSlide(undefined)
    setTimeout(() => setCurrentSlide(id), 10)
  }

  const addSlide = () => {
    updateSlides([...slides, { id: String(Math.random()), elements: [] }])
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

  const moveSlideUp = () => {
    updateSlides(
      slides.map((s, i) =>
        i === slideIndex - 1
          ? slides[slideIndex]
          : i === slideIndex
          ? slides[slideIndex - 1]
          : s
      )
    )
  }
  const moveSlideDown = () => {
    updateSlides(
      slides.map((s, i) =>
        i === slideIndex + 1
          ? slides[slideIndex]
          : i === slideIndex
          ? slides[slideIndex + 1]
          : s
      )
    )
  }
  const deleteSlide = () => {
    updateSlides(slides.filter((s) => s.id !== currentSlide))
    if (isLastSlide) {
      goToPreviousSlide()
    } else {
      goToNextSlide()
    }
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

  const exportFile = () => {
    const a = document.createElement('a')
    a.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(slides, undefined, 2))
    )
    a.setAttribute('download', 'Untitled.edslides')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const importFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const json = e.target?.result as string
        try {
          const slides = JSON.parse(json)
          changeCurrentSlide(slides[0].id)
          updateSlides(slides)
          input.value = ''
        } catch (err) {
          alert('Something went wrong when importing the file.')
          console.error(err)
        }
      }
      reader.readAsText(input.files[0])
    }
  }

  return slides.length > 0 ? (
    <>
      {editMode && (
        <div className="slides-list">
          <div className="import-export">
            <label role="button" className="button">
              <ImportIcon width={16} />
              <input type="file" onChange={importFile} />
            </label>
            <button className="button" onClick={exportFile}>
              <ExportIcon width={16} />
            </button>
          </div>
          <ul>
            {slides.map((slide, index) => (
              <li key={slide.id}>
                <button
                  className={
                    'button' + (slide.id === currentSlide ? ' active' : '')
                  }
                  onClick={() => changeCurrentSlide(slide.id)}
                >
                  #{index + 1}
                </button>
                {slide.id === currentSlide && (
                  <ul>
                    <li>
                      <button
                        className="button"
                        disabled={isFirstSlide}
                        onClick={moveSlideUp}
                      >
                        ↑
                      </button>
                    </li>
                    <li>
                      <button
                        className="button"
                        disabled={isLastSlide}
                        onClick={moveSlideDown}
                      >
                        ↓
                      </button>
                    </li>
                    <li>
                      <button
                        className="button"
                        disabled={slides.length === 1}
                        onClick={deleteSlide}
                      >
                        ✕
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ))}
            <li>
              <button className="button" onClick={addSlide}>
                +
              </button>
            </li>
          </ul>
        </div>
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
