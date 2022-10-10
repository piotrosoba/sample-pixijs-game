import Game from '../Game'
import { Graphics } from 'pixi.js'
import config from '../config'

class Spinner extends Graphics {
  game: Game
  constructor(game: Game) {
    super()
    this.game = game
    this.x = config.WIDTH / 2
    this.y = config.HEIGHT / 2
    const r = 5
    const d = 2.5 * r
    this.beginFill(config.PRIMARY_COLOR)
    this.drawEllipse(-d, 0, r, r)
    this.drawEllipse(0, d, r, r)
    this.drawEllipse(d, 0, r, r)
    this.drawEllipse(0, -d, r, r)
  }

  startSpin() {
    this.game.ticker.add(this.onUpdate, this)
    return this
  }

  stopSpin() {
    this.game.ticker.remove(this.onUpdate, this)
    return this
  }

  onUpdate() {
    this.rotation += 0.05
  }
}

export default Spinner
