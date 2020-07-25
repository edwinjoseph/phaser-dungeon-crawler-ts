import Phaser from 'phaser'
import Lizard from '../enemies/Lizard'

import { FAUNA, createCharacterAnims } from '../anims/CharacterAnims'

import { createLizardAnims } from '../anims/EnemyAnims'

import { debugDraw } from '../utils/debug'

export default class Game extends Phaser.Scene
{
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private fauna!: Phaser.Physics.Arcade.Sprite

  private hit = 0;

  constructor() {
		super('game')
	}

	preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    createCharacterAnims(this.anims)
    createLizardAnims(this.anims)

    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)

    const floors = map.createStaticLayer('Floors', tileset)
    const walls = map.createStaticLayer('Walls', tileset)
    const decorations = map.createStaticLayer('Decorations', tileset)

    walls.setCollisionByProperty({ collides: true })

    this.fauna = this.physics.add.sprite(152, 35, 'fauna')
    this.fauna.body.setSize(this.fauna.width * .5, this.fauna.height * .55)
    this.fauna.body.offset.y = this.fauna.height * .5


    this.fauna.anims.play(FAUNA.IDLEDOWN)

    this.cameras.main.startFollow(this.fauna, true)

    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizard = go as Lizard
        lizard.body.onCollide = true
        lizard.body.setSize(lizard.width * .8, lizard.height * .7)
        lizard.body.offset.y = lizard.height * .45
      }
    })

    lizards.get(50, 150)

    this.physics.add.collider(this.fauna, walls)
    this.physics.add.collider(lizards, walls)
    this.physics.add.collider(lizards, this.fauna, this.handlePlayerLizardCollision, undefined, this)
  }

  private handlePlayerLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const lizard = obj2 as Lizard

    const dx = this.fauna.x - lizard.x
    const dy = this.fauna.y - lizard.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    this.fauna.setVelocity(dir.x, dir.y)

    this.hit = 1;
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.fauna) {
      return
    }

    if (this.hit > 0) {
      this.hit = this.hit > 10 ? 0 : this.hit + 1
      return;
    }

    const speed = 80;

    if (this.cursors.left?.isDown) {
      this.fauna.scaleX = -1
      this.fauna.body.offset.x = this.fauna.body.width * 1.5

      this.fauna.play(FAUNA.RUNSIDE, true)
      this.fauna.setVelocity(-speed, 0)
    } else if (this.cursors.right?.isDown) {
      this.fauna.scaleX = 1
      this.fauna.body.offset.x = this.fauna.body.width * 0.5

      this.fauna.play(FAUNA.RUNSIDE, true)
      this.fauna.setVelocity(speed, 0)
    } else if (this.cursors.up?.isDown) {
      this.fauna.play(FAUNA.RUNUP, true)
      this.fauna.setVelocity(0, -speed)
    } else if (this.cursors.down?.isDown) {
      this.fauna.play(FAUNA.RUNDOWN, true)
      this.fauna.setVelocity(0, speed)
    } else {
      const dir = this.fauna.anims.currentAnim.key.split('-').pop()?.toUpperCase();
      this.fauna.play(FAUNA[`IDLE${dir}`], true)
      this.fauna.setVelocity(0, 0)
    }
  }
}
