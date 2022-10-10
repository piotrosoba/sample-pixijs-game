import Game from './Game'
import setCanvasSize from './utils/setCanvasSize'

const game = new Game()
document.body.append(game.view)

setCanvasSize(game.view)
window.addEventListener('resize', () => setCanvasSize(game.view))
