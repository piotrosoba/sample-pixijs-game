import { DisplayObject, UPDATE_PRIORITY } from 'pixi.js'
import Game from '../Game'

interface GameObject extends DisplayObject {
  width?: number
  height?: number
}

class Collider {
  game: Game
  collisionsToCheck: {
    objects1: GameObject[]
    objects2: GameObject[]
    callback: Function
  }[]

  constructor(game: Game) {
    this.game = game
    this.collisionsToCheck = []

    this.game.ticker.add(this.onUpdate, this, UPDATE_PRIORITY.UTILITY)
  }

  addCollision(objects1: GameObject[], objects2: GameObject[], callback: Function) {
    this.collisionsToCheck.push({ objects1, objects2, callback })
  }

  checkCollision(o1: GameObject, o2: GameObject) {
    if (!o1.width || !o1.height || !o2.width || !o2.height) return
    return o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.height + o1.y > o2.y
  }

  onUpdate() {
    this.collisionsToCheck.forEach(({ objects1, objects2, callback }) => {
      objects1.forEach(object1 => {
        objects2.forEach(object2 => {
          if (this.checkCollision(object1, object2)) {
            callback(object1, object2)
          }
        })
      })
    })
  }
}

export default Collider
