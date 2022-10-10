import config from '../../config'
import { Sprite, Texture } from 'pixi.js'

class FoodFrame extends Sprite {
  velocityY: number

  constructor(texture: Texture, velocityY: number) {
    super(texture)
    this.velocityY = velocityY
    this.x = (config.WIDTH - this.width) * Math.random()
  }
}

export default FoodFrame
