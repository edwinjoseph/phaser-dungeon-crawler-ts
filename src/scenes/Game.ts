import Phaser from 'phaser'

import Lizard from '../enemies/Lizard'
import Fauna from '../characters/Fauna'

import { createCharacterAnims } from '../anims/CharacterAnims'
import { createLizardAnims } from '../anims/EnemyAnims'

import '../characters/Fauna'

import { debugDraw } from '../utils/debug'

export default class Game extends Phaser.Scene
{
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private fauna!: Fauna

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

    this.fauna = this.add.fauna(152, 35, 'fauna')

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

    // debugDraw(walls, this)
  }

  private handlePlayerLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const lizard = obj2 as Lizard

    const dx = this.fauna.x - lizard.x
    const dy = this.fauna.y - lizard.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    this.fauna.handleDamage(dir)
  }

  update(t: number, dt: number) {

    if (this.fauna) {
      this.fauna.update(this.cursors)
    }
  }
}
