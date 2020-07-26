import Phaser from 'phaser'

import { FAUNA } from '../anims/CharacterAnims'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      fauna(x: number, y: number, texture: string, frame?: string | number): Fauna
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
}

export default class Fauna extends Phaser.Physics.Arcade.Sprite {
  private speed = 80
  private healthState = HealthState.IDLE
  private damageTime = 0

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    this.anims.play(FAUNA.IDLEDOWN)
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }
    this.setVelocity(dir.x, dir.y)
    this.setTint(0xFF0000)
    this.healthState = HealthState.DAMAGE
    this.damageTime = 0

    const animDir = this.anims.currentAnim.key.split('-').pop()?.toUpperCase();
    this.play(FAUNA[`IDLE${animDir}`], true)
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)
    
    switch (this.healthState) {
      case HealthState.DAMAGE:
        this.damageTime += dt
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE
          this.setTint(0xFFFFFF)
          this.damageTime = 0
        }
        break;
      default:
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors || this.healthState === HealthState.DAMAGE) {
      return
    }

    if (cursors.left?.isDown) {
      this.scaleX = -1
      this.body.offset.x = this.body.width * 1.5

      this.play(FAUNA.RUNSIDE, true)
      this.setVelocity(-this.speed, 0)
    } else if (cursors.right?.isDown) {
      this.scaleX = 1
      this.body.offset.x = this.body.width * 0.5

      this.play(FAUNA.RUNSIDE, true)
      this.setVelocity(this.speed, 0)
    } else if (cursors.up?.isDown) {
      this.play(FAUNA.RUNUP, true)
      this.setVelocity(0, -this.speed)
    } else if (cursors.down?.isDown) {
      this.play(FAUNA.RUNDOWN, true)
      this.setVelocity(0, this.speed)
    } else {
      const dir = this.anims.currentAnim.key.split('-').pop()?.toUpperCase();
      this.play(FAUNA[`IDLE${dir}`], true)
      this.setVelocity(0, 0)
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('fauna', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new Fauna(this.scene, x, y, texture, frame)
  
  this.displayList.add(sprite)
  this.updateList.add(sprite)

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

  sprite.body.setSize(sprite.width * .5, sprite.height * .5)
  sprite.body.offset.y = sprite.height * .5

  return sprite
})
