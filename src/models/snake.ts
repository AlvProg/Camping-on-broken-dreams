/**
 * Clase del enemigo
 */
export default class Snake {

  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  constructor(scene: Phaser.Scene, x: number, y: number) {

    const anims = scene.anims;
    anims.create({
      key: "arrastrarse",
      frames: anims.generateFrameNumbers("personajes", { start: 69, end: 72 }),
      frameRate: 8,
      repeat: -1,
    });


    this.sprite = scene.physics.add.sprite(x, y, "personajes", 60)
    .setSize(22, 33)
    .setOffset(23, 27);

    this.sprite.anims.play("arrastrarse");  
  }

 

  update() {
    const sprite = this.sprite;
    const velocidad = 300;
    const prevVel = sprite.body.velocity.clone();
    
  }
}
