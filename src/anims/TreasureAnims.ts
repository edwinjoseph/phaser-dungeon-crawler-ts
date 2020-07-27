import Phaser from 'phaser'

enum ANIMATION {
  OPEN = 'chest-open',
  CLOSED = 'chest-closed',
}

export const CHEST = {
  ANIMATION,
  CLOSED: 'chest_empty_open_anim_f0.png'
}

export const createTreasureAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: CHEST.ANIMATION.OPEN,
    frames: anims.generateFrameNames('treasure', {
      start: 0,
      end: 2,
      prefix: 'chest_empty_open_anim_f',
      suffix: '.png',
    }),
    frameRate: 6,
  })
  anims.create({
    key: CHEST.ANIMATION.CLOSED,
    frames: [{
      key: 'treasure',
      frame: CHEST.CLOSED
    }]
  })
}