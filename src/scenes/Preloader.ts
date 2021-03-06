import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

	preload() {
    this.load.tilemapTiledJSON('dungeon', 'dungeons/dungeon-01.json')

    this.load.atlas('fauna', 'character/fauna.png', 'character/fauna.json')
    this.load.atlas('lizard', 'enemies/lizard.png', 'enemies/lizard.json')
    this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')
    
    this.load.image('tiles', 'tiles/dungeon_tiles_extruded.png')
    this.load.image('ui-heart-empty', 'ui/heart_empty.png')
    this.load.image('ui-heart-full', 'ui/heart_full.png')
    this.load.image('knife', 'weapons/knife.png')
  }

  create() {
    this.scene.start('game')
  }
}