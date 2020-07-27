import Phaser from 'phaser'

import Lizard from '../enemies/Lizard'
import Fauna from '../characters/Fauna'

import { createCharacterAnims } from '../anims/CharacterAnims'
import { createLizardAnims } from '../anims/EnemyAnims'

import { sceneEvents, EVENTS } from '../events/EventCenter'


import '../characters/Fauna'

import { debugDraw } from '../utils/debug'

export default class Game extends Phaser.Scene
{
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private fauna!: Fauna
  
  private knifes!: Phaser.Physics.Arcade.Group;
  private lizards!: Phaser.Physics.Arcade.Group;

  private playerLizardCollider!: Phaser.Physics.Arcade.Collider

  constructor() {
		super('game')
	}

	preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    this.scene.run('game-ui')

    createCharacterAnims(this.anims)
    createLizardAnims(this.anims)

    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)

    const floors = map.createStaticLayer('Floors', tileset)
    const walls = map.createStaticLayer('Walls', tileset)
    const decorations = map.createStaticLayer('Decorations', tileset)

    walls.setCollisionByProperty({ collides: true })

    this.knifes = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    })

    this.fauna = this.add.fauna(152, 35, 'fauna')
    this.fauna.setKnifes(this.knifes)

    this.cameras.main.startFollow(this.fauna, true)

    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizard = go as Lizard
        lizard.body.onCollide = true
        lizard.body.setSize(lizard.width * .8, lizard.height * .7)
        lizard.body.offset.y = lizard.height * .45
      }
    })

    this.lizards.get(50, 150)

    this.physics.add.collider(this.fauna, walls)
    this.physics.add.collider(this.lizards, walls)
    this.physics.add.collider(this.knifes, walls, this.handleKnifesWallsCollision, undefined, this);
    this.physics.add.collider(this.knifes, this.lizards, this.handleKnifesLizardCollision, undefined, this);
    this.playerLizardCollider = this.physics.add.collider(this.lizards, this.fauna, this.handlePlayerLizardCollision, undefined, this)

    // debugDraw(walls, this)
  }

  private handleKnifesWallsCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    this.knifes.killAndHide(obj1)

  }

  private handleKnifesLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    this.knifes.killAndHide(obj1)
    this.lizards.killAndHide(obj2)
  }

  private handlePlayerLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const lizard = obj2 as Lizard

    const dx = this.fauna.x - lizard.x
    const dy = this.fauna.y - lizard.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    this.fauna.handleDamage(dir)
    sceneEvents.emit(EVENTS.PLAYER.HEALTH, this.fauna.health)

    if (this.fauna.health <= 0) {
      this.playerLizardCollider.destroy();
    }
  }

  update(t: number, dt: number) {

    if (this.fauna) {
      this.fauna.update(this.cursors)
    }
  }
}
