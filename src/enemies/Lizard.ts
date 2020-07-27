import Phaser from 'phaser'

import Chest from '../items/Chest'
import Fauna from '../characters/Fauna'

import { sceneEvents, EVENTS } from '../events/EventCenter'

enum DIRECTION {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const getNewDirection = (excludes) => {
  let direction = Phaser.Math.Between(0, 3)

  while (excludes.includes(direction)) {
    direction = Phaser.Math.Between(0, 3)
  }
  

  return direction
}

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
  private direction = DIRECTION.RIGHT
  private previousDirection = -1;
  private moveEvent: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision)
    scene.physics.world.on(Phaser.Physics.Arcade.Events.COLLIDE, this.handleObjectCollision)

    this.moveEvent = scene.time.addEvent({
      delay: 2000, 
      callback: () => {
        this.newDirection()
      },
      loop: true,
    })

    this.anims.play('lizard-run')
  }

  private handleTileCollision = (go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) => {
    if (go !== this) {
      return;
    }
    
    this.newDirection()
  }

  private handleObjectCollision = (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {
    if (obj1 instanceof Fauna) {
      const fauna = obj1 as Fauna;
      const lizard = obj2 as Lizard

      const dx = fauna.x - lizard.x
      const dy = fauna.y - lizard.y

      const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

      fauna.handleDamage(dir)
      return
    }

    if (obj2 instanceof Chest) {
      this.newDirection()
      return
    }
    
    if (obj2 instanceof Phaser.Physics.Arcade.Image) {
      if (obj2.texture.key === 'knife') {
        obj2.destroy();
        obj1.destroy();
      }
      return;
    }
  }

  private newDirection() {
    const excludeDirections = [this.direction, this.previousDirection]

    this.previousDirection = this.direction
    this.direction = getNewDirection(excludeDirections);
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)

    const speed = 50

    switch (this.direction) {
      case DIRECTION.UP:
        this.setVelocity(0, -speed)
        break;
      case DIRECTION.DOWN:
        this.setVelocity(0, speed)
        break;
      case DIRECTION.LEFT:
        this.setVelocity(-speed, 0)
        break;
      case DIRECTION.RIGHT:
        this.setVelocity(speed, 0)
        break;
    }
  }

  destroy(fromScene?: boolean) {
    this.moveEvent.destroy()
    
    super.destroy(fromScene)
  }
}
