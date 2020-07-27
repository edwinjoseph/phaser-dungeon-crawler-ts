import Phaser from 'phaser'

import Lizard from '../enemies/Lizard'
import Fauna from '../characters/Fauna'
import Chest from '../items/Chest'

import { createCharacterAnims } from '../anims/CharacterAnims'
import { createLizardAnims } from '../anims/EnemyAnims'
import { createTreasureAnims, CHEST } from '../anims/TreasureAnims'

import { sceneEvents, EVENTS } from '../events/EventCenter'


import '../characters/Fauna'

import { debugDraw } from '../utils/debug'

export default class Game extends Phaser.Scene
{
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private fauna!: Fauna
  
  private knifes!: Phaser.Physics.Arcade.Group;
  private lizards!: Phaser.Physics.Arcade.Group;

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
    createTreasureAnims(this.anims)

    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)

    const floors = map.createStaticLayer('Floors', tileset)
    const walls = map.createStaticLayer('Walls', tileset)
    const decorations = map.createStaticLayer('Decorations', tileset)

    walls.setCollisionByProperty({ collides: true })

    const chests = this.physics.add.staticGroup({
      classType: Chest,
    }) 
    const chestsLayer = map.getObjectLayer('Chests')
    chestsLayer.objects.forEach(chest => {
      chests.get(chest.x! + chest.width! * 0.5, chest.y! - chest.height! * 0.5, 'treasure')
    })

    this.knifes = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3,
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

    const enemiesLayer = map.getObjectLayer('Enemies')
    enemiesLayer.objects.forEach(enemy => {
      if (enemy.type === 'lizard') {
        this.lizards.get(enemy.x! + enemy.width! * 0.5, enemy.y! - enemy.height! * 0.5, 'lizard')
      }
    })

    this.physics.add.collider(this.fauna, walls)
    this.physics.add.collider(this.fauna, chests, this.handlePlayerChestCollision, undefined, this)

    this.physics.add.collider(this.lizards, walls)
    this.physics.add.collider(this.lizards, chests)
    this.physics.add.collider(this.lizards, this.knifes)
    this.physics.add.collider(this.lizards, this.fauna)

    this.physics.add.collider(this.knifes, walls, this.handleKnifesWallsCollision, this.processKnifesWallsCollision, this)
  }

  private handlePlayerChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const chest = obj2 as Chest
    this.fauna.setChest(chest)
  }

  private processKnifesWallsCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    return obj1.active
  }
  private handleKnifesWallsCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    this.knifes.killAndHide(obj1)
  }

  update(t: number, dt: number) {
    if (this.fauna) {
      this.fauna.update(this.cursors)
    }
  }
}
