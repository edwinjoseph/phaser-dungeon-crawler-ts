import Phaser from 'phaser'

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
      console.log(go, this);
      return;
    }
    
    this.newDirection()
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
