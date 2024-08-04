/* eslint-disable no-undef */
// Select the menu button and menu component
let isOpen = false
const hamButtons = document.querySelectorAll('.nav_menu-link')
const menu = document.querySelector('.menu_container')
const menuBackground1 = document.querySelector('.menu_background-1')
const menuBackground2 = document.querySelector('.menu_background-2')
const menuLinks = menu.querySelectorAll('a') // Select all links within the menu

import gsap from 'gsap' // Import GSAP
import { ScrollTrigger } from 'gsap/all' // Import necessary plugins if used

gsap.registerPlugin(ScrollTrigger) // Register plugins if needed

// Function to toggle menu
function toggleMenu() {
  const tl = gsap.timeline()

  if (isOpen) {
    // If menu is open, move it out of the screen (top)
    tl.to(
      menuBackground2,
      {
        y: '-100%',
        duration: 0.5, // Animate background-2 a bit slower
        ease: 'power2.in',
        onStart: () => {
          menuBackground2.classList.add('blur')
        },
        onComplete: () => {
          menuBackground2.classList.remove('blur')
        },
      },
      0
    ).to(
      menuBackground1,
      {
        y: '-100%',
        duration: 0.4, // Animate background-1 a bit faster
        ease: 'power2.in',
        onComplete: () => {
          isOpen = false

          // Store menu state in localStorage
          localStorage.setItem('menuState', 'closed')

          // Set menu style to display none
          menu.style.display = 'none'
        },
      },
      0
    )
  } else {
    // If menu is closed, move it in from the top
    menu.style.display = 'flex' // Ensure menu is visible before moving in
    tl.fromTo(
      menuBackground2,
      {
        y: '-100%',
      },
      {
        y: '0%',
        duration: 0.33, // Animate background-2 a bit slower
        ease: 'power1.out',
        onStart: () => {
          menuBackground2.classList.add('blur')
        },
        onComplete: () => {
          menuBackground2.classList.remove('blur')
        },
      },
      0
    ).fromTo(
      menuBackground1,
      {
        y: '-100%',
      },
      {
        y: '0%',
        duration: 0.5, // Animate background-1 a bit faster
        ease: 'power2.out',
        onComplete: () => {
          isOpen = true

          // Store menu state in localStorage
          localStorage.setItem('menuState', 'open')
        },
      },
      0
    )
  }
}

console.log(hamButtons)

// Add event listener to toggle the menu on each menu button click
hamButtons.forEach((button) => {
  button.addEventListener('click', () => {
    console.log('Menu button clicked:', button) // Log the clicked button
    toggleMenu()
  })
})

// Add event listener to close the menu when a link is clicked and navigate
menuLinks.forEach((link) => {
  // Hover in event listener
  menuBackground1.addEventListener('mouseenter', () => {
    gsap.to(menuBackground1, {
      x: -10, // Move background-1 slightly to the left
      duration: 0.5,
      ease: 'power1.out',
    })
  })

  // Hover out event listener
  menuBackground1.addEventListener('mouseleave', () => {
    gsap.to(menuBackground1, {
      x: 0, // Return background-1 to its original position
      duration: 0.2,
      ease: 'power1.out',
    })
  })

  // Click event listener (for navigation)
  link.addEventListener('click', (event) => {
    event.preventDefault() // Prevent default link behavior
    const targetUrl = link.href // Get the target URL

    if (isOpen) {
      // Change the menu state to closed
      isOpen = false
      localStorage.setItem('menuState', 'closed')

      // Create a GSAP timeline for the animations
      const tl = gsap.timeline()

      // Add animations to the timeline
      tl.to(
        menuBackground1,
        {
          opacity: 0,
          duration: 0.3,
        },
        0
      )
        .to(
          menuBackground2,
          {
            opacity: 0,
            duration: 0.32,
          },
          0.1
        )
        .to(
          '#page-wrapper',
          {
            opacity: 0,
            duration: 0.32,
          },
          0
        )
        .call(() => {
          // Redirect to the target URL after a slight delay
          setTimeout(() => {
            window.location.href = targetUrl
          }, 100) // Adjust the delay time as needed
        })
    }
  })

  // Function to close the menu when clicking outside
  function handleClickOutside(event) {
    if (
      isOpen &&
      !menu.contains(event.target) &&
      !Array.from(hamButtons).some((button) => button.contains(event.target))
    ) {
      toggleMenu()
    }
  }

  // Add event listener for clicking outside the menu
  document.addEventListener('click', handleClickOutside)
})
