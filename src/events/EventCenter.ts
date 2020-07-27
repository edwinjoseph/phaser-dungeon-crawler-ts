import Phaser from 'phaser'

enum PLAYER {
  HEALTH = 'player-health-changed'
}

export const EVENTS = {
  PLAYER
}

export const sceneEvents = new Phaser.Events.EventEmitter()
