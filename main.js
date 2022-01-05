import { createBoard } from './board.js'
import { createInput } from './input.js'
import { createPacMan } from './pacman.js'
import { createPathFinder } from './path.js'

main().catch(console.error)

async function main() {
  const boardString = await fetch('./board.txt').then(res => res.text())
  const { board, render } = createBoard(boardString)
  const canvas = document.querySelector('#game')
  const ctx = canvas.getContext('2d')
  render(ctx)
  const { findPath, renderPath } = createPathFinder(board.clear, board.width, board.height)
  const { getPos, update, render: renderPacman, changeDirection } = createPacMan({ x: 1, y: 1 }, board)

  const { listen } = createInput()
  listen('KeyA|ArrowLeft', () => changeDirection('left'))
  listen('KeyD|ArrowRight', () => changeDirection('right'))
  listen('KeyW|ArrowUp', () => changeDirection('up'))
  listen('KeyS|ArrowDown', () => changeDirection('down'))

  loop(delta => {
    render(ctx)
    update(delta)
    const path = findPath(getPos(), { x: 24, y: 14 })
    renderPath(ctx, path)
    renderPacman(ctx)
  })
}

function loop(cb) {
  let lastTime = 0
  requestAnimationFrame(iteration)
  function iteration(time) {
    const delta = (time - lastTime) / 1000
    lastTime = time
    cb(delta)
    requestAnimationFrame(iteration)
  }
}
