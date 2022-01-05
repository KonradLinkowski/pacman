import { TILE_SIZE } from './config.js'

const typeMap = {
  '#': 'wall',
  '.': 'floor',
  'o': 'pellet',
  'O': 'superPellet',
  '-': 'door'
}

const arcMap = {
  pellet: {
    color: 'orange',
    radius: 0.2
  },
  superPellet: {
    color: 'orange',
    radius: 0.45
  }
}

const opacityColorMap = {
  opaque: 'blue',
  clear: 'black'
}

const opacityMap = {
  wall: 'opaque',
  floor: 'clear',
  pellet: 'clear',
  superPellet: 'clear',
  door: 'clear'
}

const plurify = s => s + 's'

export function createBoard(boardString) {
  const board = parseBoard(boardString)
  const render = createRender(board)

  return {
    board,
    render
  }
}

function createRender(board) {
  return ctx => {
    ctx.canvas.width = board.width * TILE_SIZE
    ctx.canvas.height = board.height * TILE_SIZE
    for (const { type, x, y, opacity } of board.allTiles) {
      const backgroundColor = opacityColorMap[opacity]
      ctx.fillStyle = backgroundColor
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      ctx.strokeStyle = 'black'
      ctx.strokeWidth = 0
      ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      if (type in arcMap) {
        const { color, radius } = arcMap[type]
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, radius * TILE_SIZE, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }
}

function parseBoard(boardString) {
  const rows = boardString.split('\n')

  const board = {
    floors: [],
    walls: [],
    pellets: [],
    superPellets: [],
    doors: [],
    rests: [],
    opaque: [],
    clear: [],
    allTiles: [],
    dict: {},
    width: rows[0].length,
    height: rows.length
  }

  rows.forEach((row, y) => row.split('').forEach((char, x) => {
    const type = typeMap[char]
    if (!type) {
      throw new ParseError(char, x, y)
    }
    const plural = plurify(type)
    const opacity = opacityMap[type]
    const tile = { type, x, y, char, opacity }
    board[plural].push(tile)
    board[opacity].push(tile)
    board.allTiles.push(tile)
  }))

  for (const tile of board.allTiles) {
    if (!(tile.x in board.dict)) {
      board.dict[tile.x] = {}
    }
    board.dict[tile.x][tile.y] = tile
  }

  return board
}

class ParseError extends Error {
  constructor(char, x, y) {
    super(`Invalid board character: ${char} at x: ${x}, y: ${y}`)
  }
}
