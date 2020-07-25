import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
  constructor() {
		super('game')
	}

	preload() {
    
  }

  create() {
    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon', 'tiles')

    const floors = map.createStaticLayer('Floors', tileset)
    const walls = map.createStaticLayer('Walls', tileset)
    const decorations = map.createStaticLayer('Decorations', tileset)

    walls.setCollisionByProperty({ collides: true })
  }
}
