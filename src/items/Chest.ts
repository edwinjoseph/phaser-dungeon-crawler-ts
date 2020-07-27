import Phaser from 'phaser'
import { CHEST } from '~/anims/TreasureAnims'

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  private maxCoins = 200;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.play(CHEST.ANIMATION.CLOSED)
  }

  open() {
    if (this.anims.currentAnim.key !== CHEST.ANIMATION.CLOSED) {
      return 0;
    }

    this.play(CHEST.ANIMATION.OPEN)
    return Phaser.Math.Between(50, this.maxCoins)
  }
}