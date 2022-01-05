import { TILE_SIZE } from './config.js'

const dirMap = {
  'left': { x: -1, y: 0 },
  'up': { x: 0, y: -1 },
  'right': { x: 1, y: 0 },
  'down': { x: 0, y: 1 },
  'null': { x: 0, y: 0 }
}

const dirQueueMap = {
  'left': ['up', 'down'],
  'right': ['up', 'down'],
  'up': ['left', 'right'],
  'down': ['left', 'right']
}

export function createPacMan(position, board) {
  const { dict, width, height } = board
  const speed = 10

  const pos = {
    x: position.x,
    y: position.y
  }

  let dir = null
  let dirQueue = null
  
  return {
    getPos: () => ({ x: Math.round(pos.x) % width, y: Math.round(pos.y) % height }),
    update: delta => {
      const { x, y } = dirMap[dir]
      const newX = pos.x + x * delta * speed
      const newY = pos.y + y * delta * speed

      if (dirQueue && isPosQueueClear(pos, dirQueue, dict, width, height) || !canMove(pos, dir, dict, width, height)) {
        pos.x = Math.round(pos.x)
        pos.y = Math.round(pos.y)
        dir = dirQueue
        dirQueue = null
      } else {
        pos.x = (width + newX) % width
        pos.y = (height + newY) % height
      }
    },
    changeDirection: d => {
      if (!dir) {
        dir = d
        dirQueue = null
      } else if (!dirQueueMap[dir].includes(d)) {
        dir = d
        dirQueue = null
      } else {
        dirQueue = d
      }
    },
    render: ctx => {
      ctx.fillStyle = 'magenta'
      ctx.beginPath()
      ctx.arc(pos.x * TILE_SIZE + TILE_SIZE / 2, pos.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}

function canMove(pos, dir, dict, width, height) {
  const { x, y } = dirMap[dir]
  const nextX = Math.round(width + pos.x + x) % width
  const nextY = Math.round(height + pos.y + y) % height
  const next  = dict[nextX][nextY]
  if (next.opacity == 'clear') {
    return true
  }
  
  return pos.x < next.x - 0.5 && pos.x > next.x - 0.5 && pos.y < next.y - 0.5 && pos.y > next.y - 0.5
}

function isPosQueueClear(pos, dir, dict, width, height) {
  const { x, y } = dirMap[dir]
  const nextX = Math.round(pos.x + x)
  const nextY = Math.round(pos.y + y)
  const next = dict[nextX][nextY]
  return next.opacity == 'clear'
}
