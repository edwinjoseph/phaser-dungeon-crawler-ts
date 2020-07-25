import Phaser from 'phaser'

export const debugDraw = (target: Phaser.Tilemaps.StaticTilemapLayer, scene: Phaser.Scene) => {
  const debugGraphics = scene.add.graphics().setAlpha(0.7)
  target.renderDebug(debugGraphics, {
    tileColor: null,
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    faceColor: new Phaser.Display.Color(40, 39, 37, 255),
  })
}