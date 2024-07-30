/* eslint-disable no-unused-vars */
// Select all work cards
function setupGridLayoutPattern() {
  const workCards = Array.from(document.querySelectorAll('.work_card')) // Convert NodeList to array

  const layoutPattern = [
    { rows: 1, cols: 3 },
    { rows: 1, cols: 3 },
    { rows: 1, cols: 3 },
    { rows: 3, cols: 3 },
  ]

  // Generate an array of indices representing the order
  const indices = Array.from({ length: workCards.length }, (_, i) => i)

  // Iterate over each work card and apply the shuffled layout pattern
  workCards.forEach((card, index) => {
    const { rows, cols } = layoutPattern[indices[index] % layoutPattern.length]

    // Apply grid layout
    card.style.gridRow = `span ${rows}`
    card.style.gridColumn = `span ${cols}`
  })
}
