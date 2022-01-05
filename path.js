import { TILE_SIZE } from './config.js'

export function createPathFinder(tiles, width, height) {
  const nodes = getNodes(tiles, width, height)

  const findPath = createFindPath(nodes)

  return {
    findPath,
    renderPath
  }
}

function renderPath(ctx, path) {
  for (const p of path) {
    ctx.fillStyle = 'red'
    ctx.fillRect(p.x * TILE_SIZE, p.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
  }
}

function getNodes(tiles, width, height) {
  const nodes = tiles.map(({ x, y }) => ({ x, y }))
  for (const node of nodes) {
    node.neighbours = [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]
    .map(({ x, y }) => nodes.find(n => n.x == (width + node.x + x) % width && n.y == (height + node.y + y) % height))
    .filter(Boolean)
  }
  return nodes
}

function createFindPath(nodes) {
  // very inefficient Dijkstra
  return (start, end) => {
    const startNode = nodes.find(node => node.x == start.x && node.y == start.y)
    const endNode = nodes.find(node => node.x == end.x && node.y == end.y)
    const queue = []
    const dist = new WeakMap()
    const prev = new WeakMap()

    for (const node of nodes) {
      dist.set(node, Infinity)
      prev.set(node, null)
      queue.push(node)
    }
    dist.set(startNode, 0)

    while (queue.length) {
      const min = findMin(queue, dist)
      const index = queue.findIndex(v => dist.get(v) == min)
      const [u] = queue.splice(index, 1)

      if (u == endNode) {
        const path = []
        let current = u
        while (current) {
          path.unshift(current)
          current = prev.get(current)
        }
        return path
      }

      for (const v of u.neighbours.filter(n => queue.includes(n))) {
        const alt = dist.get(u) + 1
        if (alt < dist.get(v)) {
          dist.set(v, alt)
          prev.set(v, u)
        }
      }
    }

    return null
  }
}

function findMin(queue, dict) {
  let min = Infinity
  for (const item of queue) {
    const v = dict.get(item)
    if (v < min) {
      min = v
    }
  }
  return min
}
