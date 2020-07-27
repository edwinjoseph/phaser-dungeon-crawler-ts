import Phaser from 'phaser'

enum PLAYER {
  HEALTH = 'player-health-changed',
  COINS = 'player-coins-changed',
}

export const EVENTS = {
  PLAYER
}

export const sceneEvents = new Phaser.Events.EventEmitter()
