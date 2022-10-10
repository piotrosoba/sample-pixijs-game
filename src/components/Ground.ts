import { Graphics } from 'pixi.js'
import config from '../config'

class Ground extends Graphics {
  constructor() {
    super()
    this.beginFill(config.PRIMARY_COLOR)
    this.drawRect(0, 0, config.WIDTH, config.GROUND_HEIGHT)
    this.y = config.HEIGHT - this.height
  }
}

export default Ground
