import Splide from '@splidejs/splide'
import '@splidejs/splide/css'

var splide = new Splide('.splide', {
  type: 'loop',
  perPage: 3,
  perMove: 1,
  arrows: false,
  classes: {
    prev: 'splide__arrow--prev swiper-button swiper-btn-prev',
    next: 'splide__arrow--next swiper-button swiper-btn-next',
  },
})

splide.mount()

var prevButton = document.querySelector('.arrow-prev')
var nextButton = document.querySelector('.arrow-next')

console.log(prevButton)
console.log(nextButton)

prevButton.addEventListener('click', function (e) {
  e.preventDefault()
  splide.go('<')
})

nextButton.addEventListener('click', function (e) {
  e.preventDefault()
  splide.go('>')
})
