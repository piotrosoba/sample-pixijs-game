import { Texture, Rectangle, BaseTexture } from 'pixi.js'

export const ANIMATION_KEYS = {
  WALK_LEFT: 'WALK_LEFT',
  WALK_RIGHT: 'WALK_RIGHT',
  JUMP_LEFT: 'JUMP_LEFT',
  JUMP_RIGHT: 'JUMP_RIGHT',
  JUMP_IDLE: 'JUMP_IDLE',
  IDLE: 'IDLE'
}

const FRAME_WIDTH = 84
const FRAME_HEIGHT = 84

export const ANIMATION_DATA = {
  [ANIMATION_KEYS.IDLE]: { pivotY: -2, animationSpeed: 0.1 },
  [ANIMATION_KEYS.IDLE]: { pivotY: -2, animationSpeed: 0.1 },
  [ANIMATION_KEYS.WALK_LEFT]: { pivotY: 0, animationSpeed: 0.15 },
  [ANIMATION_KEYS.WALK_RIGHT]: { pivotY: 0, animationSpeed: 0.15 },
  [ANIMATION_KEYS.JUMP_LEFT]: { pivotY: 0, animationSpeed: 0.15 },
  [ANIMATION_KEYS.JUMP_RIGHT]: { pivotY: 0, animationSpeed: 0.15 },
  [ANIMATION_KEYS.JUMP_IDLE]: { pivotY: 0, animationSpeed: 0.15 }
}

export interface AnimationTextures {
  [animationKey: string]: Texture[]
}

const FRAMES_DATA: { [animationKey: string]: [row: number, column: number][] } = {
  [ANIMATION_KEYS.IDLE]: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3]
  ],
  [ANIMATION_KEYS.WALK_LEFT]: [
    [2, 4],
    [2, 5],
    [2, 6],
    [2, 7],
    [3, 0],
    [3, 1]
  ],
  [ANIMATION_KEYS.WALK_RIGHT]: [
    [1, 6],
    [1, 7],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3]
  ],
  [ANIMATION_KEYS.JUMP_LEFT]: [[2, 5]],
  [ANIMATION_KEYS.JUMP_IDLE]: [[0, 0]],
  [ANIMATION_KEYS.JUMP_RIGHT]: [[1, 7]]
}

export function generateCharacterAnimations(BaseTexture: BaseTexture): AnimationTextures {
  const animationTextures: AnimationTextures = {}

  Object.entries(FRAMES_DATA).forEach(([animationKey, frames]) => {
    const textures = frames.map(
      ([row, column]) =>
        new Texture(BaseTexture, new Rectangle(column * FRAME_WIDTH, row * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT))
    )
    animationTextures[animationKey] = textures
  })

  return animationTextures
}
