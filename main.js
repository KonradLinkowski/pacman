import { createBoard } from './board.js'

main().catch(console.error)

async function main() {
  const boardString = await fetch('./board.txt').then(res => res.text())
  const { render } = createBoard(boardString)
  const canvas = document.querySelector('#game')
  const tileSize = 30
  const ctx = canvas.getContext('2d')
  render(ctx, tileSize)
}
