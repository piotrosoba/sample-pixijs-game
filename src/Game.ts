import { Application, Texture, Text } from 'pixi.js'
import { Assets } from '@pixi/assets'
import config from './config'

import Controls from './managers/Controls'
import Collider from './managers/Collider'
import Spinner from './components/Spinner'

import Ground from './components/Ground'
import Character from './components/Character'
import Food from './components/Food'

interface LoadData {
  key: string
  url: string
}

class Game extends Application {
  controls: Controls
  collider: Collider
  textures!: { [textureName: string]: Texture }

  spinner: Spinner
  ground!: Ground
  character!: Character
  food!: Food
  scoreText!: Text
  livesText!: Text
  playButton: HTMLButtonElement | null
  modal: HTMLDivElement | null
  modalText: HTMLDivElement | null

  score: number
  lives: number

  constructor() {
    super({
      width: config.WIDTH,
      height: config.HEIGHT,
      backgroundColor: config.BACKGROUND_COLOR,
      antialias: true,
      autoStart: false
    })

    this.playButton = document.querySelector('button')
    this.playButton?.addEventListener('click', () => this.onClickPlay())
    this.modal = document.querySelector('.modal')
    this.modalText = document.querySelector('.modal_text')

    this.onFoodTouchCaharacter = this.onFoodTouchCaharacter.bind(this)
    this.onFoodTouchGround = this.onFoodTouchGround.bind(this)

    this.score = 0
    this.lives = 0

    this.controls = new Controls(this)
    this.collider = new Collider(this)

    this.spinner = new Spinner(this)
    this.spinner.startSpin()
    this.stage.addChild(this.spinner)

    this.loadAssets()
  }

  loadAssets() {
    const data: LoadData[] = [
      { key: 'food', url: 'assets/food.png' },
      { key: 'character', url: 'assets/character.png' }
    ]
    data.forEach(el => Assets.add(el.key, el.url))
    Assets.load(data.map(el => el.key)).then(textures => {
      this.textures = textures
      this.spinner.stopSpin()
      this.stage.removeChild(this.spinner)
      this.create()
    })
  }

  create() {
    this.ground = new Ground()
    this.character = new Character(this)
    this.food = new Food(this)
    this.scoreText = new Text('')
    this.scoreText.x = 5
    this.livesText = new Text('')
    this.livesText.anchor.x = 1
    this.livesText.x = config.WIDTH - 5

    this.stage.addChild(this.ground, this.character, this.food, this.scoreText, this.livesText)
    this.collider.addCollision([this.character], [this.ground], this.character.onTouchGround)
    this.collider.addCollision([this.character], this.food.children, this.onFoodTouchCaharacter)
    this.collider.addCollision([this.ground], this.food.children, this.onFoodTouchGround)

    this.setStartState()
  }

  onClickPlay() {
    if (this.character) {
      this.setStartState()
    }
    this.start()

    if (this.modal) {
      this.modal.style.display = 'none'
    }
  }

  gameOver() {
    this.stop()

    if (this.modal && this.modalText && this.playButton) {
      this.modal.style.display = 'flex'
      this.modalText.innerText = 'Game Over!\n Your score:' + this.score
      this.playButton.innerText = 'Play again'
    }
  }

  setStartState() {
    this.character.y = config.HEIGHT - this.ground.height - this.character.height
    this.lives = config.LIVES
    this.score = 0
    this.scoreText.text = 'Score: ' + this.score
    this.livesText.text = 'Lives: ' + this.lives
    this.food.removeChildren()
  }

  addScore() {
    this.score += config.SCORE_PER_FOOD
    this.scoreText.text = 'Score: ' + this.score
  }

  takeLivePoint() {
    this.lives -= 1
    this.livesText.text = 'Lives: ' + this.lives
    if (this.lives <= 0) this.gameOver()
  }

  onFoodTouchCaharacter(character: Character, food: Texture) {
    food.destroy()
    this.addScore()
  }

  onFoodTouchGround(ground: Ground, food: Texture) {
    food.destroy()
    this.takeLivePoint()
  }
}

export default Game
