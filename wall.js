import { TILE_SIZE } from './config.js'

export function categorizeWall(wall, dict) {
  const neighbours = [
    { x: 0, y: -1, index: 0 },
    { x: 1, y: 0, index: 1 },
    { x: 0, y: 1, index: 2 },
    { x: -1, y: 0, index: 3 },
    { x: -1, y: -1, index: 4 },
    { x: 1, y: -1, index: 5 },
    { x: 1, y: 1, index: 6 },
    { x: -1, y: 1, index: 7 }
  ]
  .map(n => {
    const x = wall.x + n.x
    const y = wall.y + n.y
    if (!(x in dict)) return null
    if (!(y in dict[x])) return null
    if (dict[x][y].type != 'wall') return null
    return n.index
  })
  .filter(e => e != null)

  const category = neighbours.reduce((sum, c) => sum + Math.pow(2, c), 0)
  return category
}

export function getWallPath({ x, y, category }) {
  const s = TILE_SIZE
  const tx = x * s
  const ty = y * s
  switch (category) {
    // double lines
    case 2:
    case 8:
    case 10:
    case 26:
    case 42:
    case 74:
    case 138:
      // double horizontal line
      return new Path2D(`M ${tx} ${ty + s / 4} h ${s} M ${tx} ${ty + s * 3 / 4} h ${s}`)

    case 5:
    case 21:
    case 37:
    case 69:
    case 133:
      // double vertical line
      return new Path2D(`M ${tx + s / 4} ${ty} v ${s} M ${tx + s * 3 / 4} ${ty} v ${s}`)

    // single lines
    case 59:
    case 123:
    case 187:
      // single bottom horizontal line
      return new Path2D(`M ${tx} ${ty + s * 3 / 4} h ${s}`)

    case 206:
    case 222:
    case 238:
      // single top horizontal line
      return new Path2D(`M ${tx} ${ty + s / 4} h ${s}`)

    case 103:
    case 119:
    case 231:
      // single left vertical line
      return new Path2D(`M ${tx + s / 4} ${ty} v ${s}`)

    case 157:
    case 189:
    case 221:
      // single right vertical line
      return new Path2D(`M ${tx + s * 3 / 4} ${ty} v ${s}`)

    // single big corners
    case 35:
      // single big left bottom corner
      return new Path2D(`M ${tx + s / 4} ${ty} q ${0} ${s * 3 / 4}, ${s * 3 / 4} ${s * 3 / 4}`)

    case 25:
      // single big right bottom corner
      return new Path2D(`M ${tx + s * 3 / 4} ${ty} q ${0} ${s * 3 / 4}, ${-s * 3 / 4} ${s * 3 / 4}`)

    case 70:
      // single big left top corner
      return new Path2D(`M ${tx + s} ${ty + s / 4} q ${-s * 3 / 4} ${0}, ${-s * 3 / 4} ${s * 3 / 4}`)

    case 140:
      // single big right top corner
      return new Path2D(`M ${tx} ${ty + s / 4} q ${s * 3 / 4} ${0}, ${s * 3 / 4} ${s * 3 / 4}`)

    // single big corners
    case 223:
      // single small left bottom corner
      return new Path2D(`M ${tx + s * 3 / 4} ${ty} q ${0} ${s / 4}, ${s / 4} ${s / 4}`)

    case 239:
      // single small right bottom corner
      return new Path2D(`M ${tx + s / 4} ${ty} q ${0} ${s / 4}, ${-s / 4} ${s / 4}`)

    case 191:
      // single small left top corner
      return new Path2D(`M ${tx + s} ${ty + s * 3 / 4} q ${-s / 4} ${0}, ${-s / 4} ${s / 4}`)

    case 127:
      // single small right top corner
      return new Path2D(`M ${tx} ${ty + s * 3 / 4} q ${s / 4} ${0}, ${s / 4} ${s / 4}`)

    // double corners
    case 6:
      // double left top corner
      return new Path2D(`
        M ${tx + s} ${ty + s / 4} q ${-s * 3 / 4} ${0}, ${-s * 3 / 4} ${s * 3 / 4}
        M ${tx + s} ${ty + s * 3 / 4} q ${-s / 4} ${0}, ${-s / 4} ${s / 4}
      `)

    case 3:
      // double left bottom corner
      return new Path2D(`
        M ${tx + s / 4} ${ty} q ${0} ${s * 3 / 4}, ${s * 3 / 4} ${s * 3 / 4}
        M ${tx + s * 3 / 4} ${ty} q ${0} ${s / 4}, ${s / 4} ${s / 4}
      `)

    case 12:
      // double right top corner
      return new Path2D(`
        M ${tx} ${ty + s / 4} q ${s * 3 / 4} ${0}, ${s * 3 / 4} ${s * 3 / 4}
        M ${tx} ${ty + s * 3 / 4} q ${s / 4} ${0}, ${s / 4} ${s / 4}
      `)

    case 9:
      // double right bottom corner
      return new Path2D(`
        M ${tx + s * 3 / 4} ${ty} q ${0} ${s * 3 / 4}, ${-s * 3 / 4} ${s * 3 / 4}
        M ${tx + s / 4} ${ty} q ${0} ${s / 4}, ${-s / 4} ${s / 4}
      `)

    // forks
    case 71:
      // left vertical top fork
      return new Path2D(`
        M ${tx + s / 4} ${ty} v ${s}
        M ${tx + s * 3 / 4} ${ty} q ${0} ${s / 4}, ${s / 4} ${s / 4}
      `)

    case 39:
      // left vertical bottom fork
      return new Path2D(`
        M ${tx + s / 4} ${ty} v ${s}
        M ${tx + s} ${ty + s * 3 / 4} q ${-s / 4} ${0}, ${-s / 4} ${s / 4}
      `)

    case 141:
      // right vertical top fork
      return new Path2D(`
        M ${tx + s * 3 / 4} ${ty} v ${s}
        M ${tx + s / 4} ${ty} q ${0} ${s / 4}, ${-s / 4} ${s / 4}
      `)

    case 29:
      // right vertical bottom fork
      return new Path2D(`
        M ${tx + s * 3 / 4} ${ty} v ${s}
        M ${tx} ${ty + s * 3 / 4} q ${s / 4} ${0}, ${s / 4} ${s / 4}
      `)

    case 78:
      // top horizontal left fork
      return new Path2D(`
        M ${tx} ${ty + s / 4} h ${s}
        M ${tx} ${ty + s * 3 / 4} q ${s / 4} ${0}, ${s / 4} ${s / 4}
      `)

    case 142:
      // top horizontal right fork
      return new Path2D(`
        M ${tx} ${ty + s / 4} h ${s}
        M ${tx + s} ${ty + s * 3 / 4} q ${-s / 4} ${0}, ${-s / 4} ${s / 4}
      `)
    
    case 43:
      // bottom horizontal left fork
      return new Path2D(`
        M ${tx} ${ty + s * 3 / 4} h ${s}
        M ${tx + s / 4} ${ty} q ${0} ${s / 4}, ${-s / 4} ${s / 4}
      `)

    case 27:
      // bottom horizontal right fork
      return new Path2D(`
        M ${tx} ${ty + s * 3 / 4} h ${s}
        M ${tx + s * 3 / 4} ${ty} q ${0} ${s / 4}, ${s / 4} ${s / 4}
      `) 
  }
  return new Path2D()
}
