import { Container, Texture, Rectangle } from 'pixi.js'
import config from '../../config'
import Game from '../../Game'

import FoodFrame from './FoodFrame'

const FOOD_FRAME_WIDTH = 16
const FOOD_FRAME_HEIGHT = 16

class Food extends Container {
  game: Game
  timeToNextFood: number
  foodTextures: Texture[]
  children!: FoodFrame[]

  constructor(game: Game) {
    super()
    this.game = game
    this.foodTextures = this.makeFoodTextures()
    this.timeToNextFood = 0

    this.game.ticker.add(this.onUpdate, this)
  }

  makeFoodTextures() {
    const baseTexture = this.game.textures.food.baseTexture
    const textures: Texture[] = []

    const columns = baseTexture.width / FOOD_FRAME_WIDTH
    const rows = baseTexture.height / FOOD_FRAME_HEIGHT

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const texture = new Texture(
          baseTexture,
          new Rectangle(c * FOOD_FRAME_WIDTH, r * FOOD_FRAME_HEIGHT, FOOD_FRAME_WIDTH, FOOD_FRAME_HEIGHT)
        )
        textures.push(texture)
      }
    }
    return textures
  }

  getRandomFoodTexture(): Texture {
    return this.foodTextures[Math.round(Math.random() * this.foodTextures.length)]
  }

  addFoodFrame() {
    const velocityY =
      config.MIN_FOOD_VELOCITY +
      (config.MAX_DEFAULT_FOOD_VELOCITY - config.MIN_FOOD_VELOCITY) * Math.random() +
      this.game.score * config.ADDITIONAL_FOOD_VEOLICTY_SCORE_MULTIPLY
    const foodFrame = new FoodFrame(this.getRandomFoodTexture(), velocityY)
    this.addChild(foodFrame)
  }

  onUpdate(delta: number) {
    this.timeToNextFood -= delta
    if (this.timeToNextFood < 0) {
      this.timeToNextFood =
        config.FOOD_DROP_INTERVAL - this.game.score * config.FOOD_INTERVAL_DECREASE_BY_SCORE_MULTIPLY
      this.addFoodFrame()
    }

    this.children.forEach((foodFrame: FoodFrame) => {
      foodFrame.y += foodFrame.velocityY * delta
    })
  }
}

export default Food
