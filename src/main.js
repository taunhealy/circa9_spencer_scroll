import './styles/style.css'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './menu'
import './layoutArray'

// Initialize Lenis
const lenis = new Lenis({
  lerp: 0.07,
  wheelMultiplier: 1,
})

// Lenis Setup
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Page load setup of functions
document.addEventListener('DOMContentLoaded', function () {
  setupModal()
  staggerAnimation()
  setupCategoryFiltering()
  setupWorkSelectsModal()
  setupCustomCursor()
})

//Scroll Back To Top
document.addEventListener('DOMContentLoaded', () => {
  const scrollButton = document.querySelector('#scroll-button')

  if (!scrollButton) {
    console.log('No element with the ID "scroll-button" found.')
    return
  }

  scrollButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
})

// Setup Modal
function setupModal() {
  const modal = document.querySelector('.modal_container')
  if (!modal) {
    console.error('Element with class "modal_container" not found')
    return
  }

  const closeButton = document.querySelector('#button-close')
  const nextButton = document.querySelector('#button-next')
  const prevButton = document.querySelector('#button-prev')
  const modalVideo = document.querySelector('#modalVideo')
  const modalImage = document.querySelector('.modal_image')
  const spinner = document.querySelector('#spinner')
  const workItems = document.querySelectorAll('.work_selects_item')

  if (
    !closeButton ||
    !nextButton ||
    !prevButton ||
    !modalVideo ||
    !modalImage ||
    !spinner
  ) {
    console.error('One or more modal elements not found')
    return
  }

  closeButton.addEventListener('click', closeModal)
  nextButton.addEventListener('click', nextItem)
  prevButton.addEventListener('click', prevItem)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  workItems.forEach((item) => {
    item.addEventListener('click', () => {
      document
        .querySelector('.work_selects_item.is-active')
        ?.classList.remove('is-active')
      item.classList.add('is-active')
      openModal(item)
    })
  })

  function openModal(item) {
    const videoLink = item.dataset.videoLink
    console.log('Video Link:', videoLink)
    const imageSrc = item.querySelector('img').src
    const brand = item.querySelector('.work_brand').textContent
    const title = item.querySelector('.work_title').textContent
    const directorName = item.dataset.director

    modal.querySelector('.modal_brand').textContent = brand
    modal.querySelector('.modal_title').textContent = title
    modal.querySelector('.modal-director_heading').textContent = directorName

    if (videoLink) {
      const vimeoId = videoLink.split('/').pop()
      const embedUrl = `https://player.vimeo.com/video/${vimeoId}`
      spinner.style.display = 'block'
      modalVideo.style.display = 'block'
      modalImage.style.display = 'none'

      const iframe = document.createElement('iframe')
      iframe.src = embedUrl
      iframe.width = '100%'
      iframe.height = '100%'
      iframe.frameBorder = '0'
      iframe.allow = 'autoplay; fullscreen'
      iframe.allowFullscreen = true

      modalVideo.innerHTML = ''
      modalVideo.appendChild(iframe)

      iframe.onload = () => {
        gsap.to(spinner, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            spinner.style.display = 'none'
          },
        })
      }

      iframe.onerror = () => {
        console.error('Iframe failed to load')
        gsap.to(spinner, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            spinner.style.display = 'none'
          },
        })
      }

      iframe.onerror = () => {
        console.error('Iframe failed to load')
        spinner.style.display = 'none'
      }
    } else {
      modalVideo.style.display = 'none'
      modalImage.style.display = 'block'
      modalImage.src = imageSrc
    }

    modal.style.display = 'block'

    const tl = gsap.timeline()
    tl.set(item.querySelector('.work_card-highlight'), {
      display: 'block',
      opacity: 0.65,
    }).to(modal, { opacity: 1, duration: 0.1, ease: 'power3.out' }, '<')

    modal.classList.add('active')
  }

  function closeModal() {
    const tl = gsap.timeline({
      onComplete: () => {
        modal.style.display = 'none'
        modal.classList.remove('active')
        modalVideo.innerHTML = ''
      },
    })
    tl.to(modal, { opacity: 0, duration: 0.21, ease: 'power3.out' })
  }

  function nextItem() {
    let currentItem = document.querySelector('.work_selects_item.is-active')
    let nextItem = currentItem.nextElementSibling
    if (!nextItem) {
      nextItem = workItems[0]
    }
    currentItem.classList.remove('is-active')
    nextItem.classList.add('is-active')
    openModal(nextItem)
  }

  function prevItem() {
    let currentItem = document.querySelector('.work_selects_item.is-active')
    let prevItem = currentItem.previousElementSibling
    if (!prevItem) {
      prevItem = workItems[workItems.length - 1]
    }
    currentItem.classList.remove('is-active')
    prevItem.classList.add('is-active')
    openModal(prevItem)
  }
}

// Open modal on Work Selects collection list
function setupWorkSelectsModal() {
  const workSelectsListWrapper = document.querySelector(
    '.work_selects_list_wrapper'
  )
  const workSelectsItems = document.querySelectorAll(
    '.work_selects_list .work_selects_item'
  )

  if (!workSelectsListWrapper) {
    console.error('Element with class "work_selects_list_wrapper" not found')
    return
  }

  workSelectsItems.forEach((item) => {
    item.addEventListener('click', () => {
      openModal(item) // Assuming this works for your specific modal setup
    })
  })

  function openModal(item) {
    const videoLink = item.dataset.videoLink
    const imageSrc = item.querySelector('img').src
    const brand = item.querySelector('.work_brand').textContent
    const title = item.querySelector('.work_title').textContent
    const directorName = item.dataset.director

    const modal = document.querySelector('.modal_container')
    const modalVideo = document.querySelector('#modalVideo')
    const modalImage = document.querySelector('.modal_image')
    const spinner = document.querySelector('#spinner')

    modal.querySelector('.modal_brand').textContent = brand
    modal.querySelector('.modal_title').textContent = title
    modal.querySelector('.modal-director_heading').textContent = directorName

    if (videoLink) {
      const vimeoId = videoLink.split('/').pop()
      const embedUrl = `https://player.vimeo.com/video/${vimeoId}`
      spinner.style.display = 'block'
      modalVideo.style.display = 'block'
      modalImage.style.display = 'none'

      const iframe = document.createElement('iframe')
      iframe.src = embedUrl
      iframe.width = '100%'
      iframe.height = '100%'
      iframe.frameBorder = '0'
      iframe.allow = 'autoplay; fullscreen'
      iframe.allowFullscreen = true

      modalVideo.innerHTML = ''
      modalVideo.appendChild(iframe)

      iframe.onload = () => {
        spinner.style.display = 'none'
      }

      iframe.onerror = () => {
        console.error('Iframe failed to load')
        spinner.style.display = 'none'
      }
    } else {
      modalVideo.style.display = 'none'
      modalImage.style.display = 'block'
      modalImage.src = imageSrc
    }

    modal.style.display = 'block'

    const tl = gsap.timeline()
    tl.set(item.querySelector('.work_selects_item-highlight'), {
      display: 'block',
      opacity: 0.65,
    }).to(modal, { opacity: 1, duration: 0.1, ease: 'power3.out' }, '<')

    modal.classList.add('active')
  }
}

// Page-wrapper stagger animation on page load
function staggerAnimation() {
  const wrapper = document.getElementById('page-wrapper')
  if (wrapper) {
    wrapper.style.display = 'flex'
    wrapper.style.opacity = '0'

    gsap.fromTo(
      wrapper, // Target element
      { opacity: 0.7, x: 0 }, // From properties
      {
        opacity: 1,
        x: 0,
        stagger: 0.5,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.25,
      } // To properties
    )
  }
}
// Filter by category button click
function setupCategoryFiltering() {
  const filterButtons = document.querySelectorAll('[data-button-category]')
  const items = document.querySelectorAll('.work_selects_item')

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.buttonCategory

      // First, set the display property for all items
      items.forEach((item) => {
        if (category === 'all' || item.dataset.workCategory === category) {
          gsap.set(item, { display: 'block' })
        } else {
          gsap.set(item, { display: 'none' })
        }
      })

      // Then, apply fade-in and fade-out animations
      items.forEach((item) => {
        if (category === 'all' || item.dataset.workCategory === category) {
          gsap.to(item, {
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
          })
        } else {
          gsap.to(item, {
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
          })
        }
      })
    })
  })
}

// Scroll dot
document.addEventListener('DOMContentLoaded', function () {
  gsap.to('.scroll-dot', {
    opacity: 0,
    y: 40,
    duration: 1,
    repeat: -1,
    ease: 'power1',
  })
})

// Footer Buttons Copy Email
document.addEventListener('DOMContentLoaded', function () {
  const contactButton = document.getElementById('button-email')
  const contactMessage = document.getElementById('contact_message')
  const emailTitle = document.getElementById('email-title')
  const footer = document.getElementById('contact_wrap')
  const buttonEmail = document.getElementById('button-email')

  const timeline = gsap.timeline({ paused: true })
  timeline.to(contactMessage, {
    opacity: 1,
    duration: 0.72,
    ease: 'power3.out',
    display: 'block',
  })
  timeline.to(buttonEmail, {
    backgroundColor: '',
    duration: 1,
    ease: 'power3.out',
  })
  timeline.to(footer, {
    opacity: 1,
    duration: 1,
    ease: 'power1.out',
  })
  timeline.to(contactMessage, {
    delay: 0,
    opacity: 0,
    duration: 1,
    ease: 'power1.out',
    display: 'none',
  })

  contactButton.addEventListener('click', function () {
    timeline.restart()
    // Copy email address to clipboard
    navigator.clipboard
      .writeText(emailTitle.innerText)
      .then(() => {
        console.log('Email address copied to clipboard')
        contactButton.textContent = 'Copied' // Change the button text to 'Copied'
      })
      .catch((error) => {
        console.error('Unable to copy email address to clipboard:', error)
      })
  })
})

// Scroll to Section Function
document.addEventListener('DOMContentLoaded', function () {
  // Define a common function for scrolling
  function scrollToSection(targetId) {
    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
      })
    } else {
      console.error(`Element with ID "${targetId}" not found`)
    }
  }

  // Attach event listeners to navigation buttons
  const navButtons = [
    { id: '#nav_work', target: '#work_wrap' },
    { id: '#nav_about', target: '#about_wrap' },
    { id: '#nav_contact', target: '#contact_wrap' },
    { id: '#footer_about', target: '#about_wrap' },
    { id: '#footer_work', target: '#work_wrap' },
    { id: '#footer_contact', target: '#contact_wrap' },
  ]

  navButtons.forEach((button) => {
    const element = document.querySelector(button.id)
    if (element) {
      element.addEventListener('click', () => scrollToSection(button.target))
    } else {
      console.error(`Navigation button with ID "${button.id}" not found`)
    }
  })
})

// About text fade on hover
document.addEventListener('DOMContentLoaded', function () {
  const collectionItems = document.querySelectorAll('.about-me_collection-item')
  const aboutText = document.getElementById('about_text')
  const socialLink = document.getElementById('about_link')

  const originalText = aboutText ? aboutText.textContent : ''

  if (!aboutText) {
    console.error('Element with ID "about_text" not found')
  }

  if (!socialLink) {
    console.error('Element with ID "about_link" not found')
  }

  collectionItems.forEach((item) => {
    const descriptionDiv = item.querySelector('div[data-description]')
    const description = descriptionDiv
      ? descriptionDiv.getAttribute('data-description')
      : null
    const image = item.querySelector('.about-me_image')

    if (!description) {
      console.error('No data-description found for:', item)
    }

    if (!image) {
      console.error('No image element found for:', item)
    } else {
      image.addEventListener('mouseenter', () => {
        if (aboutText) {
          gsap.fromTo(
            aboutText,
            { opacity: 1 },
            {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                aboutText.textContent = description
                gsap.fromTo(
                  aboutText,
                  { opacity: 0 },
                  { opacity: 1, duration: 0.3 }
                )
              },
            }
          )
        }
      })

      image.addEventListener('click', () => {
        if (socialLink) {
          window.open(socialLink.href, socialLink.target)
        } else {
          console.error('Social link element is missing')
        }
      })

      image.addEventListener('mouseleave', () => {
        if (aboutText) {
          gsap.fromTo(
            aboutText,
            { opacity: 1 },
            {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                aboutText.textContent = originalText
                gsap.fromTo(
                  aboutText,
                  { opacity: 0 },
                  { opacity: 1, duration: 0.3 }
                )
              },
            }
          )
        }
      })
    }
  })
})

// Show only 5 Project Items
document.addEventListener('DOMContentLoaded', function () {
  // Select all items in the list
  const items = document.querySelectorAll(
    '.work_selects_list .work_selects_item'
  )

  // Hide all items initially
  items.forEach((item) => {
    item.style.display = 'none'
  })

  // Show only the first 5 items
  for (let i = 0; i < Math.min(7, items.length); i++) {
    items[i].style.display = 'block'
  }
})

//Background Hero Cover Image Animation On Hover
document.addEventListener('DOMContentLoaded', () => {
  const heroImageCover = document.querySelector('.hero_image-cover')
  const workSelectsItems = document.querySelectorAll('.work_selects_item')

  if (!heroImageCover) {
    console.error('Hero image cover not found')
    return
  }

  console.log(
    'Initial computed styles:',
    window.getComputedStyle(heroImageCover)
  )

  function setBackgroundImage(imageUrl) {
    console.log(`Setting background image to: ${imageUrl}`)

    // Set the background image using setAttribute
    heroImageCover.setAttribute(
      'style',
      `background-image: url('${imageUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
    )

    // Force a repaint
    heroImageCover.style.display = 'none'
    heroImageCover.offsetHeight // Trigger a reflow
    heroImageCover.style.display = 'block'

    // Log the results
    console.log('After setting background:')
    console.log(
      'Element style attribute:',
      heroImageCover.getAttribute('style')
    )
    console.log(
      'Computed backgroundImage:',
      window.getComputedStyle(heroImageCover).backgroundImage
    )
    console.log(
      'Full computed styles:',
      window.getComputedStyle(heroImageCover)
    )
  }

  workSelectsItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const workCardImage = item.querySelector('.work_card_image-1')
      if (workCardImage && workCardImage.src) {
        setBackgroundImage(workCardImage.src)
      }
    })
  })

  // Set initial image
  if (workSelectsItems.length > 0) {
    const firstItemImage =
      workSelectsItems[0].querySelector('.work_card_image-1')
    if (firstItemImage) {
      setBackgroundImage(firstItemImage.src)
    }
  }
})

// Active class add for work item buttons on button click
document.addEventListener('DOMContentLoaded', () => {
  const workItemButtons = document.querySelectorAll(
    '.work_filter-categories_button'
  )
  workItemButtons.forEach((button) => {
    button.addEventListener('click', function () {
      workItemButtons.forEach((btn) => btn.classList.remove('active-class'))
      this.classList.add('active-class')
    })
  })
})

// Highlight Project Item on hover
document.addEventListener('DOMContentLoaded', () => {
  const workSelectsItems = document.querySelectorAll(
    '.work_selects_item.is-work'
  )

  workSelectsItems.forEach((item) => {
    item.addEventListener('mouseover', () => {
      const highlight = item.querySelector('.work_selects_item-highlight')
      if (highlight) {
        console.log(highlight)
        highlight.style.opacity = '0'
      }
    })

    item.addEventListener('mouseout', () => {
      const highlight = item.querySelector('.work_selects_item-highlight')
      if (highlight) {
        highlight.style.opacity = '0.5' // Adjust to your default opacity
      }
    })
  })
})

// Animate sections of page-wrapper using GSAP
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger)

  // Select all direct children divs of the page-wrapper and animate
  const sections = document.querySelectorAll('.page-wrapper > div')

  sections.forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 16,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%', // Trigger animation when section is in the viewport
        end: 'bottom 60%', // End animation when section leaves the viewport
        toggleActions: 'play none none none', // Only play animation on scroll
      },
    })
  })
})

// Set initial opacity of the page-wrapper to 0
const pageWrapper = document.querySelector('page-wrapper')
gsap.set(pageWrapper, { opacity: 0 })

// GSAP ScrollTrigger when section scrolled

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired')
  gsap.registerPlugin(ScrollTrigger)
  console.log('ScrollTrigger plugin registered')

  const homeHeroSidebar = document.querySelector('.home_hero_sidebar_container')
  const homeWorkSelects = document.querySelector('.home_work-selects')
  const workSection = document.querySelector('#work_wrap')
  const workFilterTitle = document.querySelector('.work-filter_title_container')

  console.log('homeHeroSidebar:', homeHeroSidebar)
  console.log('homeWorkSelects:', homeWorkSelects)

  if (homeWorkSelects && homeHeroSidebar && workSection && workFilterTitle) {
    console.log('All required elements found, creating ScrollTrigger')
    ScrollTrigger.create({
      trigger: homeWorkSelects,
      start: 'top 10%',
      end: () => `+=${workSection.offsetHeight}`,
      onEnter: () => {
        console.log('ScrollTrigger onEnter fired')
        gsap.to(homeHeroSidebar, {
          backgroundColor: 'white',
          duration: 0.5,
        })
        gsap.to(homeHeroSidebar.querySelectorAll('*'), {
          color: 'black',
          duration: 0.5,
        })
        gsap.to(workFilterTitle, {
          opacity: 0,
          display: 'none',
          duration: 0.5,
        })
      },
      onLeaveBack: () => {
        console.log('ScrollTrigger onLeaveBack fired')
        gsap.to(homeHeroSidebar, {
          backgroundColor: 'black',
          duration: 0.5,
        })
        gsap.to(homeHeroSidebar.querySelectorAll('*'), {
          color: 'white',
          duration: 0.5,
        })
        gsap.to(workFilterTitle, {
          opacity: 1,
          display: 'block',
          duration: 0.5,
        })
      },
      markers: true,
    })
  } else {
    console.log('One or more required elements not found')
  }
})

// Custom cursor functionality
function setupCustomCursor() {
  const cursorContainer = document.querySelector('.mouse-cursor_container')
  const cursor = document.querySelector('.mouse-cursor')
  const cursorHover = document.querySelector('.mouse-cursor_button-hover')
  const workSelectsItems = document.querySelectorAll('.work_selects_item')

  if (!cursorContainer || !cursor || !cursorHover) {
    console.error('Custom cursor elements not found')
    return
  }

  let mouseX = 0,
    mouseY = 0
  let cursorX = 0,
    cursorY = 0
  let lastX = 0,
    lastY = 0
  const trailFactor = 0.15
  let isMoving = false
  let moveTimeout

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    // Add blur effect when moving
    if (!isMoving) {
      isMoving = true
      cursor.classList.add('blur')
      cursorHover.classList.add('blur')
    }

    // Clear existing timeout
    clearTimeout(moveTimeout)

    // Set new timeout
    moveTimeout = setTimeout(() => {
      isMoving = false
      cursor.classList.remove('blur')
      cursorHover.classList.remove('blur')
      gsap.to([cursor, cursorHover], { scaleX: 1, scaleY: 1, duration: 0.3 })
    }, 100) // Adjust this value to control how quickly the blur effect fades after stopping
  })

  function animateCursor() {
    const dx = mouseX - cursorX
    const dy = mouseY - cursorY

    cursorX += dx * trailFactor
    cursorY += dy * trailFactor

    cursorContainer.style.transform = `translate(${cursorX}px, ${cursorY}px)`

    // Calculate speed and direction for stretching
    const speed = Math.sqrt(
      Math.pow(cursorX - lastX, 2) + Math.pow(cursorY - lastY, 2)
    )
    const angle = Math.atan2(cursorY - lastY, cursorX - lastX)
    const blurAmount = Math.min(speed / 3, 10) // Adjust these values to control the blur intensity

    // Calculate stretch based on speed
    const maxStretch = 2 // Maximum stretch factor
    const stretchX = 1 + (speed / 30) * Math.abs(Math.cos(angle))
    const stretchY = 1 + (speed / 50) * Math.abs(Math.sin(angle))

    // Apply stretch and rotation
    gsap.to([cursor, cursorHover], {
      scaleX: Math.min(stretchX, maxStretch),
      scaleY: Math.min(stretchY, maxStretch),
      rotation: angle * (180 / Math.PI),
      filter: `blur(${blurAmount}px)`,
      duration: 0.3,
    })

    lastX = cursorX
    lastY = cursorY

    requestAnimationFrame(animateCursor)
  }
  animateCursor()

  // Handle hover effects on work_selects_items using GSAP
  workSelectsItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      gsap.to(cursor, { opacity: 0, duration: 0.5 })
      gsap.to(cursorHover, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          // Create and append pulse rings
          for (let i = 0; i < 1.5; i++) {
            setTimeout(() => {
              const pulseRing = document.createElement('div')
              pulseRing.classList.add('pulse-ring')
              cursorContainer.appendChild(pulseRing)

              // Remove the pulse ring after animation completes
              setTimeout(() => {
                pulseRing.remove()
              }, 1500)
            }, i * 200) // Stagger the start of each pulse
          }
        },
      })
    })

    item.addEventListener('mouseleave', () => {
      gsap.to(cursor, { opacity: 0.7, duration: 0.3 })
      gsap.to(cursorHover, {
        scale: 0,
        opacity: 0,
        duration: 0.1,
        ease: 'power2.in',
      })
      // Remove any existing pulse rings
      cursorContainer
        .querySelectorAll('.pulse-ring')
        .forEach((ring) => ring.remove())
    })
  })

  console.log('Custom cursor setup complete')
}

// Call the function immediately
setupCustomCursor()
