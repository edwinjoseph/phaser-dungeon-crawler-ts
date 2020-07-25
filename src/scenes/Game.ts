import Phaser from 'phaser'
import { debugDraw } from '../utils/debug'

enum FAUNA {
  IDLEDOWN = 'fauna-idle-down',
  IDLEUP = 'fauna-idle-up',
  IDLESIDE = 'fauna-idle-side',
  RUNDOWN = 'fauna-run-down',
  RUNUP = 'fauna-run-up',
  RUNSIDE = 'fauna-run-side',
}

export default class Game extends Phaser.Scene
{
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private fauna!: Phaser.Physics.Arcade.Sprite

  constructor() {
		super('game')
	}

	preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)

    const floors = map.createStaticLayer('Floors', tileset)
    const walls = map.createStaticLayer('Walls', tileset)
    const decorations = map.createStaticLayer('Decorations', tileset)

    walls.setCollisionByProperty({ collides: true })

    this.fauna = this.physics.add.sprite(128, 128, 'fauna')
    this.fauna.body.setSize(this.fauna.width * .5, this.fauna.height * .55)
    this.fauna.body.offset.y = this.fauna.height * .5

    this.anims.create({
      key: FAUNA.IDLEDOWN,
      frames: [{
        key: 'fauna',
        frame: 'walk-down-3.png',
      }],
    })
    this.anims.create({
      key: FAUNA.IDLEUP,
      frames: [{
        key: 'fauna',
        frame: 'walk-up-3.png',
      }],
    })
    this.anims.create({
      key: FAUNA.IDLESIDE,
      frames: [{
        key: 'fauna',
        frame: 'walk-side-3.png',
      }],
    })

    this.anims.create({
      key: FAUNA.RUNDOWN,
      frames: this.anims.generateFrameNames('fauna', {
        start: 1,
        end: 8,
        prefix: 'run-down-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 16,
    })
    this.anims.create({
      key: FAUNA.RUNUP,
      frames: this.anims.generateFrameNames('fauna', {
        start: 1,
        end: 8,
        prefix: 'run-up-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 16,
    })
    this.anims.create({
      key: FAUNA.RUNSIDE,
      frames: this.anims.generateFrameNames('fauna', {
        start: 1,
        end: 8,
        prefix: 'run-side-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 16,
    })

    this.fauna.anims.play(FAUNA.IDLEDOWN)

    this.physics.add.collider(this.fauna, walls)
    this.cameras.main.startFollow(this.fauna, true)
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.fauna) {
      return
    }

    const speed = 80;

    if (this.cursors.left?.isDown) {
      this.fauna.scaleX = -1
      this.fauna.body.offset.x = this.fauna.body.width * 1.5

      this.fauna.play(FAUNA.RUNSIDE, true)
      this.fauna.setVelocityX(-speed)
    } else if (this.cursors.right?.isDown) {
      this.fauna.scaleX = 1
      this.fauna.body.offset.x = this.fauna.body.width * 0.5

      this.fauna.play(FAUNA.RUNSIDE, true)
      this.fauna.setVelocityX(speed)
    } else if (this.cursors.up?.isDown) {
      this.fauna.play(FAUNA.RUNUP, true)
      this.fauna.setVelocityY(-speed)
    } else if (this.cursors.down?.isDown) {
      this.fauna.play(FAUNA.RUNDOWN, true)
      this.fauna.setVelocityY(speed)
    } else {
      const dir = this.fauna.anims.currentAnim.key.split('-').pop()?.toUpperCase();
      this.fauna.play(FAUNA[`IDLE${dir}`], true)
      this.fauna.setVelocity(0, 0)
    }
  }
}
