import Game from '../Game'

interface Callback {
  func: Function
  context: any
}

const KEYBOARD_DATA = {
  ArrowRight: 'right',
  ArrowLeft: 'left',
  ArrowUp: 'jump',
  d: 'right',
  a: 'left',
  w: 'jump',
  ' ': 'jump'
}

class Controls {
  game: Game
  holding: Set<string>
  callbacks: { controlDown: Callback[]; controlUp: Callback[] }

  constructor(game: Game) {
    this.game = game
    this.holding = new Set()
    this.callbacks = {
      controlDown: [],
      controlUp: []
    }

    this.addKeyboardControls()
  }

  addKeyboardControls() {
    window.addEventListener('keydown', evt => {
      const control = KEYBOARD_DATA[evt.key as keyof typeof KEYBOARD_DATA]
      if (control && !this.holding.has(control)) {
        this.holding.add(control)
        this.emit('controlDown', control)
      }
    })

    window.addEventListener('keyup', evt => {
      const control = KEYBOARD_DATA[evt.key as keyof typeof KEYBOARD_DATA]
      if (control) {
        this.holding.delete(control)
        this.emit('controlUp', control)
      }
    })
  }

  emit(key: string, control: string) {
    const callbacksArr = this.callbacks[key as keyof typeof this.callbacks]
    if (!callbacksArr) return
    callbacksArr.forEach(callback => {
      callback.func.call(callback.context, control, this.holding)
    })
  }

  on(key: string, func: Function, context?: any) {
    const callbacksArr = this.callbacks[key as keyof typeof this.callbacks]
    if (!callbacksArr) return
    callbacksArr.push({ func, context })
  }

  off(key: string, func: Function, context?: any) {
    const { callbacks } = this
    const callbacksArr = this.callbacks[key as keyof typeof callbacks]
    if (!callbacksArr) return
    this.callbacks[key as keyof typeof callbacks] = callbacksArr.filter(
      callback => callback.func !== func && callback.context !== context
    )
  }
}

export default Controls
