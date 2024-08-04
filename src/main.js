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
  fadeInPageElements()
  // setupCustomCursor()
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
  const workSection = document.querySelector('#work_wrap')
  const items = workSection.querySelectorAll('.work_selects_item')

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.buttonCategory

      // First, set the display property for all items in the work section
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
    { id: '#nav_about', target: '#about-section' },
    { id: '#nav_contact', target: '#contact_wrap' },
    { id: '#footer_about', target: '#about-section' },
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
  const heroWorkSelectsItems = document.querySelectorAll(
    '.work_selects_item.is-hero'
  )

  if (!heroImageCover) {
    console.error('Hero image cover not found')
    return
  }

  let activeItem = null

  function setBackgroundImage(imageUrl, newActiveItem) {
    gsap.to(heroImageCover, {
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => {
        heroImageCover.style.backgroundImage = `url('${imageUrl}')`
        gsap.to(heroImageCover, {
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        })
      },
    })

    // Reset all items to inactive state
    heroWorkSelectsItems.forEach((item) => {
      item.classList.remove('active')
      gsap.to(item.querySelector('.work_card_image-1'), {
        opacity: 0.5,
        duration: 0.3,
      })
    })

    // Set new active item
    activeItem = newActiveItem
    activeItem.classList.add('active')
    gsap.to(activeItem.querySelector('.work_card_image-1'), {
      opacity: 1,
      duration: 0.3,
    })
  }

  heroWorkSelectsItems.forEach((item) => {
    const workCardImage = item.querySelector('.work_card_image-1')

    item.addEventListener('mouseenter', () => {
      if (workCardImage && workCardImage.src) {
        setBackgroundImage(workCardImage.src, item)
      }
    })
  })

  // Set initial image and active state to the second item (index 1)
  if (heroWorkSelectsItems.length > 1) {
    const secondItemImage =
      heroWorkSelectsItems[1].querySelector('.work_card_image-1')
    if (secondItemImage) {
      setBackgroundImage(secondItemImage.src, heroWorkSelectsItems[1])
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
      workItemButtons.forEach((btn) => {
        btn.classList.remove('active-class')
        // Reset to default state
        btn.style.color = 'black'
        btn.style.backgroundColor = 'white'
      })
      this.classList.add('active-class')
      // Invert colors for active state
      this.style.color = 'white'
      this.style.backgroundColor = 'black'
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
  const aboutSection = document.querySelector('#about-section')
  const workFilterCategories = document.querySelectorAll(
    '.work-filter_categories_item'
  )
  const workSelectsListHero = document.querySelector(
    '.work_selects_list.is-hero'
  )
  const workFilterCategoriesButtons = document.querySelectorAll(
    '.work_filter-categories_button'
  )
  const aboutProfileContainer = document.querySelector(
    '.about_profile_container'
  )
  const footer = document.querySelector('#contact_wrap')

  if (
    homeWorkSelects &&
    homeHeroSidebar &&
    workSection &&
    aboutSection &&
    workFilterCategories.length &&
    workSelectsListHero &&
    workFilterCategoriesButtons.length &&
    aboutProfileContainer &&
    footer
  ) {
    console.log('All required elements found, creating ScrollTriggers')

    // Set initial states
    gsap.set(workFilterCategories, {
      opacity: 0.2,
      backgroundColor: 'transparent',
      borderColor: 'white',
    })
    gsap.set(workSelectsListHero, { opacity: 1 })
    gsap.set(workFilterCategoriesButtons, {
      opacity: 0,
      color: 'black',
      backgroundColor: 'white',
      borderColor: 'black',
    })
    gsap.set(aboutProfileContainer, { opacity: 0 })

    // ScrollTrigger for work section start
    ScrollTrigger.create({
      trigger: workSection,
      start: 'top 80%',
      end: 'bottom top',
      onEnter: () => {
        gsap.to(workFilterCategories, {
          opacity: 1,
          backgroundColor: 'white',
          borderColor: 'black',
          duration: 0.5,
        })
        gsap.to(workFilterCategoriesButtons, {
          opacity: 1,
          duration: 0.5,
        })
        gsap.to(aboutProfileContainer, {
          opacity: 0,
          duration: 0.5,
        })
      },
      onLeaveBack: () => {
        gsap.to(workFilterCategories, {
          opacity: 0,
          backgroundColor: 'transparent',
          borderColor: 'white',
          duration: 0.5,
        })
        gsap.to(workFilterCategoriesButtons, {
          opacity: 0,
          duration: 0.5,
        })
      },
    })

    // ScrollTrigger for about section
    ScrollTrigger.create({
      trigger: aboutSection,
      start: 'top 30%',
      end: 'top 10%',
      onEnter: () => {
        gsap.to(workSelectsListHero, {
          opacity: 0,
          duration: 0.5,
        })
        gsap.to(aboutProfileContainer, {
          opacity: 0.8,
          duration: 0.5,
          ease: 'power3.in',
        })
        gsap.to(workFilterCategoriesButtons, {
          opacity: 0,
          duration: 0.5,
        })
      },
      onLeaveBack: () => {
        gsap.to(workSelectsListHero, {
          opacity: 1,
          duration: 0.5,
        })
        gsap.to(aboutProfileContainer, {
          opacity: 0.3,
          duration: 0.5,
        })
        gsap.to(workFilterCategoriesButtons, {
          opacity: 1,
          duration: 0.5,
        })
      },
    })

    // ScrollTrigger for footer
    ScrollTrigger.create({
      trigger: footer,
      start: 'top bottom',
      onEnter: () => {
        gsap.to(workFilterCategories, {
          opacity: 0.2,
          backgroundColor: 'transparent',
          borderColor: 'white',
          duration: 0.5,
        })
        gsap.to(workFilterCategoriesButtons, {
          opacity: 0,
          duration: 0.5,
        })
      },
      onLeaveBack: () => {
        gsap.to(workFilterCategories, {
          opacity: 1,
          backgroundColor: 'white',
          borderColor: 'black',
          duration: 0.5,
        })
        gsap.to(workFilterCategoriesButtons, {
          opacity: 1,
          duration: 0.5,
        })
      },
    })

    // ScrollTrigger for sidebar transition
    ScrollTrigger.create({
      trigger: workSection,
      start: 'top 80%',
      end: 'top 20%',
      onUpdate: (self) => {
        const progress = self.progress
        gsap.to(homeHeroSidebar, {
          backgroundColor: gsap.utils.interpolate(
            '#000000',
            '#ffffff',
            progress
          ),
          duration: 0,
        })
        gsap.to(
          homeHeroSidebar.querySelectorAll(
            '*:not(.work_filter-categories_button)'
          ),
          {
            color: gsap.utils.interpolate('#ffffff', '#000000', progress),
            duration: 0,
          }
        )
      },
    })

    // Add hover effects for work filter categories
    workFilterCategories.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        if (ScrollTrigger.isInViewport(workSection)) {
          gsap.to(item, {
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // 80% opacity black
            duration: 0.3,
          })
        }
      })
      item.addEventListener('mouseleave', () => {
        if (ScrollTrigger.isInViewport(workSection)) {
          gsap.to(item, {
            backgroundColor: 'white',
            duration: 0.3,
          })
        }
      })
    })
  } else {
    console.log('One or more required elements not found')
  }
})

// Add this new function
function fadeInPageElements() {
  const homeHeroSidebar = document.querySelector('.home_hero_sidebar_container')
  const pageWrapper = document.querySelector('.page-wrapper')

  if (homeHeroSidebar && pageWrapper) {
    gsap.set([homeHeroSidebar, pageWrapper], { opacity: 0 })

    gsap.to([homeHeroSidebar, pageWrapper], {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.2,
    })
  } else {
    console.error('home_hero_sidebar_container or page-wrapper not found')
  }
}
