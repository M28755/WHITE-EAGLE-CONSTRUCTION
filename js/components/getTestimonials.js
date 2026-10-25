

import { getTestimonials } from '../data/testimonialdata.js'

export async function loadTestimonials() {
  const stageContainer = document.querySelector('.testimonial-stage')
  const dotsContainer  = document.querySelector('#testimonials div[style*="justify-content: center"]')
  const prevBtn = document.getElementById('testi-prev')
  const nextBtn = document.getElementById('testi-next')

  if (!stageContainer) return

  try {
    console.log('Loading testimonials from Sanity...')
    const testimonials = await getTestimonials()

    if (!testimonials || testimonials.length === 0) {
      stageContainer.innerHTML = '<p style="padding: 2rem; color: var(--color-on-surface);">No testimonials found.</p>'
      if (dotsContainer) dotsContainer.style.display = 'none'
      return
    }

    // 1. Render Slides dynamically based on Sanity data
    stageContainer.innerHTML = testimonials
      .map((t, index) => {
        const isActive = index === 0
        const authorRole = t.position ? t.position : 'Valued Patron'
        const cleanedQuote = t.quote ? t.quote.trim() : ''

        return `
          <div class="testimonial-slide absolute-slide ${isActive ? 'opacity-100 active-slide' : 'opacity-0'}" 
               data-index="${index}" 
               style="transition: opacity 0.5s ease-in-out; ${isActive ? 'position: relative;' : 'position: absolute; top: 0; left: 0; width: 100%; pointer-events: none;'}">
            <div style="margin-bottom: 2rem;">
              <span style="font: var(--font-headline-xl); color: var(--color-primary); font-family: serif; user-select: none; line-height: 1;">“</span>
              <blockquote style="font: var(--font-headline-md); color: var(--color-on-surface); font-weight: 300; line-height: 1.6; max-width: 56rem; margin-top: -1rem;">
                ${cleanedQuote}
              </blockquote>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--color-surface-container);">
              <div>
                <div style="font: var(--font-headline-sm); color: var(--color-on-surface);">${t.person}</div>
                <div style="font: var(--font-body-sm); color: var(--color-on-surface-variant);">${authorRole}</div>
              </div>
              ${t.project ? `<div style="font: var(--font-label-blueprint); color: var(--color-primary); text-transform: uppercase;">Project: ${t.project.title}</div>` : ''}
            </div>
          </div>
        `
      })
      .join('')

    // 2. Render Navigation Dots dynamically
    if (dotsContainer) {
      dotsContainer.innerHTML = testimonials
        .map((_, index) => `
          <button class="testi-dot ${index === 0 ? 'active' : 'inactive'}" 
                  data-slide="${index}" 
                  style="cursor: pointer; border: none; width: 10px; height: 10px; border-radius: 50%; background-color: ${index === 0 ? 'var(--color-primary)' : 'var(--color-surface-container-high);'}">
          </button>
        `)
        .join('')
    }

    // 3. Carousel Slider Navigation Logic
    let currentIndex = 0
    const slides = stageContainer.querySelectorAll('.testimonial-slide')
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.testi-dot') : []

    function goToSlide(targetIndex) {
      if (!slides.length) return

      // Hide current slide
      slides[currentIndex].classList.remove('opacity-100', 'active-slide')
      slides[currentIndex].classList.add('opacity-0')
      slides[currentIndex].style.position = 'absolute'
      slides[currentIndex].style.pointerEvents = 'none'

      if (dots[currentIndex]) {
        dots[currentIndex].classList.remove('active')
        dots[currentIndex].classList.add('inactive')
        dots[currentIndex].style.backgroundColor = 'var(--color-surface-container-high)'
      }

      // Calculate new index with looping
      currentIndex = (targetIndex + slides.length) % slides.length

      // Show target slide
      slides[currentIndex].classList.remove('opacity-0')
      slides[currentIndex].classList.add('opacity-100', 'active-slide')
      slides[currentIndex].style.position = 'relative'
      slides[currentIndex].style.pointerEvents = 'auto'

      if (dots[currentIndex]) {
        dots[currentIndex].classList.remove('inactive')
        dots[currentIndex].classList.add('active')
        dots[currentIndex].style.backgroundColor = 'var(--color-primary)'
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1))
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1))
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goToSlide(idx))
    })

  } catch (error) {
    console.error('Failed to load testimonials slider:', error.message)
    if (stageContainer) {
      stageContainer.innerHTML = `<p style="color: red; padding: 2rem;">Error loading testimonials: ${error.message}</p>`
    }
  }
}
