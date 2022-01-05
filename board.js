const typeMap = {
  '#': 'wall',
  '.': 'floor',
  'o': 'pellet',
  'O': 'superPellet',
  '-': 'door'
}

const colorMap = {
  wall: 'blue',
  floor: 'grey',
  pellet: 'yellow',
  superPellet: 'orange',
  door: 'white'
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
  return (ctx, tileSize) => {
    ctx.canvas.width = board.width * tileSize
    ctx.canvas.height = board.height * tileSize
    for (const { type, x, y } of board.allTiles) {
      const color = colorMap[type]
      ctx.fillStyle = color
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
      ctx.strokeStyle = 'black'
      ctx.strokeWidth = 1
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize)
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

  return board
}

class ParseError extends Error {
  constructor(char, x, y) {
    super(`Invalid board character: ${char} at x: ${x}, y: ${y}`)
  }
}
