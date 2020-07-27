import Phaser from 'phaser'
import { sceneEvents, EVENTS } from '../events/EventCenter'

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group

  constructor() {
    super('game-ui')
  }

  create() {
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image
    })

    this.hearts.createMultiple({
      key: 'ui-heart-full',
      setXY: {
        x: 10,
        y: 10,
        stepX: 16,
      },
      quantity: 3,
    })

    const coinsLabel = this.add.text(this.sys.game.canvas.width - 15, 4, '0', { align: 'right', fontSize: 12 })
    coinsLabel.setOrigin(1, 0)
    this.add.image(this.sys.game.canvas.width - 10, 10, 'treasure', 'coin_anim_f0.png')

    sceneEvents.on(EVENTS.PLAYER.HEALTH, this.handlePlayerHealthChanged, this)
    sceneEvents.on(EVENTS.PLAYER.COINS, (coins: number) => {
      coinsLabel.text = coins.toLocaleString()
    })

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(EVENTS.PLAYER.HEALTH, this.handlePlayerHealthChanged)
      sceneEvents.off(EVENTS.PLAYER.COINS)
    })
  }

  private handlePlayerHealthChanged(health: number) {
    this.hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image
      if (idx < health) {
        heart.setTexture('ui-heart-full')
      } else {
        heart.setTexture('ui-heart-empty')
      }
    })
  }
}