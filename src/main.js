const timer = document.getElementById('timer')
const userMove = document.getElementById('move')
const totalMatched = document.getElementById('total_matched')
const gameBoard = document.querySelector('.game__board')

const modal = document.getElementById("myModal")
const playAgain = document.getElementById("playAgain")
const reset = document.getElementById("reset")

const level = document.getElementById('level')

const root = document.documentElement

let flippedCard = []
let totalToMatch = 0
let countMatched = 0
let timerStarted = false
let moves = 0
let timerId
let seconds = 0
let difficulty = level.value

level.addEventListener('change', function () {
  difficulty = this.value
  resetGame()
})

playAgain.addEventListener('click', () => {
  gameBoard.innerHTML = ''

  modal.style.display = "none"

  resetGame()
})

reset.addEventListener('click', () => {
  gameBoard.innerHTML = ''

  resetGame()
})

const professionalEmojis = [
  '👮', '👷', '💂', '🕵️',
  '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾',
  '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓',
  '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫',
  '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻',
  '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧',
]

const startTimer = () => {
  timerId = setInterval(() => {
    seconds++
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (minutes === 0) {
      timer.innerText = `${remainingSeconds}s`
      document.getElementById("timeText").innerText = `${remainingSeconds}s`

      return
    }
    if (hours === 0) {
      timer.innerText = `${minutes}m : ${remainingSeconds}s`
      document.getElementById("timeText").innerText = `${minutes}m : ${remainingSeconds}s`
      return
    }

    timer.innerText = `${hours}h : ${minutes}m : ${remainingSeconds}s`
    document.getElementById("timeText").innerText = `${hours}h : ${minutes}m : ${remainingSeconds}s`
  }, 1000)
}

const stopTimer = () => {
  clearInterval(timerId)
}

const celebrateVictory = () => {
  confetti()
}

const incrementMoves = () => {
  moves++

  userMove.innerText = moves

  document.getElementById("moveText").innerText = moves

  if (moves > 0) {
    reset.classList.add('active')
  }
}

const shuffle = (quantity) => {
  const sorted = professionalEmojis.sort(() => Math.random() - 0.5)
  const selectedEmojis = sorted.slice(0, quantity)

  return selectedEmojis.concat(selectedEmojis).sort(() => Math.random() - 0.5)
}

const generateCard = () => {
  const totalCardToMatch = document.getElementById('total_card_to_match')

  let quantity

  switch (difficulty) {
    case 'easy':
      quantity = 2
      root.style.setProperty('--template-rows', '2')
      root.style.setProperty('--template-columns', '2')
      root.style.setProperty('--card-height', '200px')
      root.style.setProperty('--card-width', '130px')
      break
    case 'medium':
      quantity = 6
      root.style.setProperty('--template-rows', '3')
      root.style.setProperty('--template-columns', '4')
      root.style.setProperty('--card-height', '100px')
      root.style.setProperty('--card-width', '75px')
      break
    case 'hard':
      quantity = 10
      root.style.setProperty('--template-rows', '4')
      root.style.setProperty('--template-columns', '5')
      root.style.setProperty('--card-height', '75px')
      root.style.setProperty('--card-width', '60px')
      break
    default:
      quantity = 2
  }


  const listOfCard = shuffle(quantity)

  totalToMatch = (listOfCard.length / 2)

  totalCardToMatch.textContent = totalToMatch

  totalMatched.textContent = countMatched

  listOfCard.forEach((item) => {

    const card = document.createElement('div')
    const face = document.createElement('div')
    const emoji = document.createElement('p')
    const back = document.createElement('div')

    gameBoard.appendChild(card)
    card.appendChild(face)
    card.appendChild(back)
    face.appendChild(emoji)

    card.classList = 'card'
    face.classList = 'face'
    back.classList = 'back'
    back.insertAdjacentHTML('beforeend', `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M3.604 7.197l7.138 -3.109a.96 .96 0 0 1 1.27 .527l4.924 11.902a1 1 0 0 1 -.514 1.304l-7.137 3.109a.96 .96 0 0 1 -1.271 -.527l-4.924 -11.903a1 1 0 0 1 .514 -1.304z" />
      <path d="M15 4h1a1 1 0 0 1 1 1v3.5" />
      <path
        d="M20 6c.264 .112 .52 .217 .768 .315a1 1 0 0 1 .53 1.311l-2.298 5.374" />
    </svg>
  `)

    emoji.innerHTML = item
    card.setAttribute('data-emoji', item)
  })
}

const flipCard = () => {
  const cards = document.querySelectorAll('.card')

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      card.classList.add('face-up')
      card.classList.add('flipped')
      checkIsMatch()
      incrementMoves()

      if (!timerStarted) {
        startTimer()
        timerStarted = true
      }
    })
  })
}

const checkIsMatch = () => {
  const cards = document.querySelectorAll('.card')
  let flippedCards = document.querySelectorAll('.flipped')

  if (flippedCards.length !== 2) return

  const [cardOne, cardTwo] = flippedCards

  const macthOne = cardOne.getAttribute('data-emoji')
  const macthTwo = cardTwo.getAttribute('data-emoji')

  cards.forEach((card) => {
    card.style.pointerEvents = 'none'
  })

  if (macthOne === macthTwo) {
    countMatched++

    flippedCards.forEach((flippedCard) => {
      flippedCard.classList.remove('flipped')
      flippedCard.classList.add('match')
      flippedCard.style.pointerEvents = 'none'
    })

    cards.forEach((card) => {
      if (!card.classList.contains('flipped') && !card.classList.contains('match')) {
        card.style.pointerEvents = 'auto'
      }
    })

    if (totalToMatch === countMatched) {
      celebrateVictory()
      stopTimer()

      modal.style.display = "block"
      document.getElementById("endText").innerText = "¡You have won the game!"
    }

    totalMatched.textContent = countMatched

    return
  }

  flippedCards.forEach((flippedCard) => {
    setTimeout(() => {
      flippedCard.classList.remove('face-up')
      flippedCard.classList.remove('flipped')
      cards.forEach((card) => {
        if (!card.classList.contains('match')) {
          card.style.pointerEvents = 'auto'
        }
      })
    }, 800)
  })
}

const resetGame = () => {
  flippedCard = [];
  totalToMatch = 0;
  countMatched = 0;
  timerStarted = false;
  moves = 0;
  seconds = 0;

  gameBoard.innerHTML = '';
  timer.innerHTML = `${seconds}s`
  userMove.innerHTML = moves
  reset.classList.remove('active')

  if (timerId) {
    stopTimer();
  }

  initGame();
};

const initGame = () => {
  generateCard()
  flipCard()
}

document.addEventListener('DOMContentLoaded', initGame)