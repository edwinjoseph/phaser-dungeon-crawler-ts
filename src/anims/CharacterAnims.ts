import Phaser from 'phaser'

export enum FAUNA {
  IDLEDOWN = 'fauna-idle-down',
  IDLEUP = 'fauna-idle-up',
  IDLESIDE = 'fauna-idle-side',
  RUNDOWN = 'fauna-run-down',
  RUNUP = 'fauna-run-up',
  RUNSIDE = 'fauna-run-side',
  FAINT = 'fauna-faint',
}

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: FAUNA.IDLEDOWN,
    frames: [{
      key: 'fauna',
      frame: 'walk-down-3.png',
    }],
  })
  anims.create({
    key: FAUNA.IDLEUP,
    frames: [{
      key: 'fauna',
      frame: 'walk-up-3.png',
    }],
  })
  anims.create({
    key: FAUNA.IDLESIDE,
    frames: [{
      key: 'fauna',
      frame: 'walk-side-3.png',
    }],
  })

  anims.create({
    key: FAUNA.RUNDOWN,
    frames: anims.generateFrameNames('fauna', {
      start: 1,
      end: 8,
      prefix: 'run-down-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 16,
  })
  anims.create({
    key: FAUNA.RUNUP,
    frames: anims.generateFrameNames('fauna', {
      start: 1,
      end: 8,
      prefix: 'run-up-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 16,
  })
  anims.create({
    key: FAUNA.RUNSIDE,
    frames: anims.generateFrameNames('fauna', {
      start: 1,
      end: 8,
      prefix: 'run-side-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 16,
  })
  anims.create({
    key: FAUNA.FAINT,
    frames: anims.generateFrameNames('fauna', {
      start: 1,
      end: 4,
      prefix: 'faint-',
      suffix: '.png',
    }),
    frameRate: 8,
  })
}
