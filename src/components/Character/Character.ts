import { AnimatedSprite, Rectangle } from 'pixi.js'
import config from '../../config'
import Game from '../../Game'
import Ground from '../Ground'

import {
  generateCharacterAnimations,
  AnimationTextures,
  ANIMATION_KEYS,
  ANIMATION_DATA
} from './generateCharacterAnimations'

class Character extends AnimatedSprite {
  game: Game
  animationTextures: AnimationTextures
  upControllsCallbacks: { [controlKey: string]: Function }
  downControllsCallbacks: { [controlKey: string]: Function }
  currentAnimation!: string
  veolcityX: number
  velocityY: number
  directionX: number
  minX: number
  maxX: number
  isJumping: boolean

  constructor(game: Game) {
    const animationTextures = generateCharacterAnimations(game.textures.character.baseTexture)
    super(animationTextures[ANIMATION_KEYS.IDLE])

    this.game = game
    this.onTouchGround = this.onTouchGround.bind(this)
    this.animationTextures = animationTextures
    this.upControllsCallbacks = {}
    this.downControllsCallbacks = {}
    this.loop = true
    this.isJumping = false
    this.veolcityX = 0
    this.velocityY = 0
    this.directionX = 0
    this.minX = -20
    this.maxX = config.WIDTH - this.width + 20

    this.setCurrentAnimation()
    this.setControlsCallbacks()
    this.game.ticker.add(this.onUpdate, this)
  }

  onUpdate(delta: number) {
    this.velocityY += delta * config.CHARACTER_GRAVITY_Y
    this.y += this.velocityY * delta

    if (this.directionX) {
      const newVelocityX = this.veolcityX + this.directionX * config.CHARACTER_POWER * delta
      this.veolcityX = Math.max(-config.MAX_CHARACTER_VELOCITY, Math.min(config.MAX_CHARACTER_VELOCITY, newVelocityX))
    } else {
      this.veolcityX = 0
    }

    this.x = Math.max(this.minX, Math.min(this.x + this.veolcityX * delta, this.maxX))

    this.setCurrentAnimation()
  }

  setCurrentAnimation() {
    const animationKey = this.getCurrentAnimationKey()

    if (this.currentAnimation !== animationKey) {
      const { animationSpeed, pivotY } = ANIMATION_DATA[animationKey]
      this.currentAnimation = animationKey
      this.textures = this.animationTextures[animationKey]
      this.animationSpeed = animationSpeed
      this.pivot.y = pivotY
      this.play()
    }
  }

  getCurrentAnimationKey(): string {
    if (this.directionX < 0) {
      if (this.isJumping) return ANIMATION_KEYS.JUMP_LEFT
      return ANIMATION_KEYS.WALK_LEFT
    }
    if (this.directionX > 0) {
      if (this.isJumping) return ANIMATION_KEYS.JUMP_RIGHT
      return ANIMATION_KEYS.WALK_RIGHT
    }
    if (this.isJumping) return ANIMATION_KEYS.JUMP_IDLE
    return ANIMATION_KEYS.IDLE
  }

  setControlsCallbacks() {
    this.downControllsCallbacks = {
      left: () => this.turnX(-1),
      right: () => this.turnX(1),
      jump: () => this.jump()
    }

    this.upControllsCallbacks = {
      left: (holding: Set<string>) => (holding.has('right') ? this.turnX(1) : this.turnX(0)),
      right: (holding: Set<string>) => (holding.has('left') ? this.turnX(-1) : this.turnX(0))
    }

    const NOOP = () => {}
    this.game.controls.on('controlDown', (control: string, holding: Set<string>) => {
      const callback = this.downControllsCallbacks[control] || NOOP
      callback(holding)
    })

    this.game.controls.on('controlUp', (control: string, holding: Set<string>) => {
      const callback = this.upControllsCallbacks[control] || NOOP
      callback(holding)
    })
  }

  turnX(x: number) {
    this.directionX = x
  }

  jump() {
    if (this.isJumping) return
    this.isJumping = true
    this.velocityY = -15
  }

  onTouchGround(character: this, ground: Ground) {
    this.velocityY = 0
    this.isJumping = false
    this.y = config.HEIGHT - ground.height - this.height
  }
}

export default Character
