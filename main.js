const firstFloor = [
  ['.', '.', '.', 'w', '.', 'w', '.', '.', '.', 'w', '.', '.', 'p'],
  ['.', '.', '.', 'w', '.', 'w', 'w', 'w', '.', 'w', '.', 'w', 'w'],
  ['.', '.', '.', 'w', '.', '.', '.', '.', '.', 'w', '.', '.', '.'],
  ['.', 'w', 'w', 'w', '.', 'w', '.', 'w', 'w', 'w', '.', 'w', '.'],
  ['.', 'w', '.', '.', '.', 'w', '.', 'w', '.', 'w', '.', 'w', '.'],
  ['.', 'w', '.', 'w', 'w', 'w', '.', 'w', '.', 'w', '.', 'w', '.'],
  ['.', 'w', '.', 'w', '.', 'w', '.', 'w', '.', 'w', 'w', 'w', '.'],
  ['.', '.', '.', 'w', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
  ['.', '.', '.', '.', '.', 'w', '.', '.', '.', 'w', '.', '.', '.'],
  ['.', 'p', '.', 'w', '.', 'w', '.', 'w', '.', 'w', '.', 'g', '.'],
  ['.', '.', '.', 'w', '.', '.', '.', 'w', '.', '.', '.', '.', '.']
]

const firstLevel = {
  map: firstFloor,
  messageData: [
    {
      x: 1,
      y: 1,
      message: [
        'Welcome to this roguelike game! This is just a Demo, so, ignore the bugs and other things like that.',
        'Here will be the messages.',
        'Controls: WASD'
      ]
    },
    {
      x: 12,
      y: 0,
      message: [
        'This is an portal!',
        'Click \'Teleport\' below to teleport to the other portal!'
      ]
    }
  ],
  portalData: [
    {
      x: 12,
      y: 0,
      to: {
        x: 1,
        y: 10
      }
    },
    {
      x: 1,
      y: 10,
      to: {
        x: 12,
        y: 0
      }
    }
  ]
}

const secondFloor = [
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', ' ', ' ', ' ', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.', '.', '.'],
  ['.', '.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.', '.'],
  ['.', '.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.', '.'],
  ['.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.'],
  ['.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.'],
  ['.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.'],
  ['.', '.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.', '.'],
  ['.', '.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.', '.'],
  ['.', '.', '.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', ' ', ' ', ' ', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', ' ', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', ' ', '.', '.', '.', '.', '.', '.', '.']
]

const secondLevel = {
  map: secondFloor,
  messageData: [
    {
      x: 11,
      y: 10,
      message: [
        'Well done!',
        ''
      ]
    }
  ]
}

let currentLevel = firstLevel

let WIDTH = currentLevel.map[0].length
let HEIGHT = currentLevel.map.length

const gameScreen = document.querySelector('#gameScreen')
const messageElement = document.querySelector('#message')
const context = gameScreen.getContext('2d')

const playerData = {
  x: 1,
  y: 1
}

function wall(x, y) {
  return currentLevel.map[y][x] == 'w' || currentLevel.map[y][x] == ' '
}

function step(key) {
  switch(key) {
    case 'w':
      if (playerData.y == 0) return
      if (wall(playerData.x, playerData.y - 1)) return
      playerData.y -= 1
      break
    case 'a':
      if (playerData.x == 0) return
      if (wall(playerData.x - 1, playerData.y)) return
      playerData.x -= 1
      break
    case 's':
      if (playerData.y == HEIGHT - 1) return
      if (wall(playerData.x, playerData.y + 1)) return
      playerData.y += 1
      break
    case 'd':
      if (playerData.x == WIDTH - 1) return
      if (wall(playerData.x + 1, playerData.y)) return
      playerData.x += 1
      break
  }

  
  if (currentLevel.map[playerData.y][playerData.x] == 'g') {
    currentLevel = secondLevel
  }

  renderMap(context)
  renderPlayer(playerData.x, playerData.y, context)

  message.innerHTML = ''

  if (currentLevel.messageData) {
    const selectedMessage = currentLevel.messageData.find((messageData) => playerData.x == messageData.x && playerData.y == messageData.y)
    
    if (selectedMessage) {
      selectedMessage.message.forEach((text) => {
        const textElement = document.createElement('p')
        textElement.textContent = text
  
        message.append(textElement)
      })
    }
  }

  if (currentLevel.portalData) {
    const selectedPortal = currentLevel.portalData.find((portalData) => playerData.x == portalData.x && playerData.y == portalData.y)
  
    if (selectedPortal) {
      const buttonElement = document.createElement('button')
      buttonElement.textContent = 'Teleport'
  
      buttonElement.addEventListener('click', () => {
        playerData.x = selectedPortal.to.x
        playerData.y = selectedPortal.to.y
        step()
      })
  
      message.append(buttonElement)
    }
  }
}

new InputHandler(step)

gameScreen.width = WIDTH
gameScreen.height = HEIGHT

function renderCheckboard(x, y, firstColor, secondColor, context) {
  const oddX = x % 2 == 1
  const oddY = y % 2 == 1
  
  context.fillStyle = firstColor
  if (oddX && oddY || !oddX && !oddY) context.fillStyle = secondColor

  context.fillRect(x, y, 1, 1)
}

function renderBlock(color, x, y, context) {
  context.fillStyle = color
  context.fillRect(x, y, 1, 1)
}

function renderPlayer(x, y, context) {
  context.fillStyle = '#d4c74e'
  context.fillRect(x, y, 1, 1)
}

function renderMap(context) {
  WIDTH = currentLevel.map[0].length
  HEIGHT = currentLevel.map.length
  gameScreen.width = WIDTH
  gameScreen.height = HEIGHT

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      currentCharacter = currentLevel.map[y][x]
  
      switch(currentCharacter) {
        case '.':
          renderCheckboard(x, y, '#74bd4a', '#77eb34', context)
          break
        case 'w':
          renderBlock('#d4654e', x, y, context)
          break
        case 'f':
          renderCheckboard(x, y, '#ede4ce', '#e3dccc', context)
          break
        case 'p':
          renderBlock('#c664ed', x, y, context)
          break
        case 'g':
          renderBlock('#64b4ed', x, y, context)
          break
      }
    }
  }
}

step()

function InputHandler(callback) {
  this.callback = callback

  this.state = {
    key: null,
    pressing: false
  }

  document.addEventListener('keydown', (event) => {
    if (this.state.pressing) return

    this.callback(event.key)
    this.state.key = event.key
    this.state.pressing = true
  })

  document.addEventListener('keyup', (event) => {
    if (event.key != this.state.key) return

    this.state.key = null
    this.state.pressing = false
  })
}