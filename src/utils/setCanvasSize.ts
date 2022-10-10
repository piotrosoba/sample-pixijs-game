import config from '../config'

interface Size {
  width: number
  height: number
}

function getGameSize(SCREEN_RATIO: number): Size {
  let height: number
  let width: number

  const screenWidth: number = window.innerWidth
  const screenHeight: number = window.innerHeight

  if (screenHeight * SCREEN_RATIO > screenWidth) {
    width = screenWidth
    height = screenWidth / SCREEN_RATIO
  } else {
    width = screenHeight * SCREEN_RATIO
    height = screenHeight
  }

  return { width, height }
}

export default function setCanvasSize(canvas: HTMLCanvasElement) {
  const size: Size = getGameSize(config.SCREEN_RATIO)
  canvas.style.width = size.width + 'px'
  canvas.style.height = size.height + 'px'
}
