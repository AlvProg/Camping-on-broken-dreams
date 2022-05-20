/**
 * Clase del jugador. Indica las posiciones de los frames de movimiento de este,
 * sus atributos (como la velocidad) y las funciones necesarias para actualizar el movimiento
 * y destruir la clase
 */
export default class Player {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const anims = scene.anims;
    anims.create({
      key: "caminar",
      frames: anims.generateFrameNumbers("personajes", { start: 46, end: 49 }),
      frameRate: 8,
      repeat: -1,
    });

    anims.create({
      key: "caminar-espalda",
      frames: anims.generateFrameNumbers("personajes", { start: 65, end: 68 }),
      frameRate: 8,
      repeat: -1,
    });

    this.sprite = scene.physics.add.sprite(x, y, "personajes", 0).setSize(22, 33).setOffset(23, 27);

    this.sprite.anims.play("caminar-espalda");

    this.keys = scene.input.keyboard.createCursorKeys();
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    const velocidad = 300;
    const prevVel = sprite.body.velocity.clone();

    // Parar el movimiento del frame anterior
    sprite.body.setVelocity(0);

    // Movimiento
    if (keys.up.isDown) {
      sprite.body.setVelocityY(-velocidad);
    } else if (keys.down.isDown) {
      sprite.body.setVelocityY(velocidad);
    } else if (keys.left.isDown) {
      sprite.body.setVelocityX(-velocidad);
      sprite.setFlipX(true);
    } else if (keys.right.isDown) {
      sprite.body.setVelocityX(velocidad);
      sprite.setFlipX(false);
    }

    // Normalizar la velocidad para evitar que al ir en diagonal vaya mas rapido
    sprite.body.velocity.normalize().scale(velocidad);

    // Actualizar la animación
    if (keys.left.isDown || keys.right.isDown || keys.down.isDown) {
      sprite.anims.play("caminar", true);
    } else if (keys.up.isDown) {
      sprite.anims.play("caminar-espalda", true);
    } else {
      sprite.anims.stop();

      // Inicio del movimiento
      prevVel.y < 0 ? sprite.setTexture("personajes", 65) : sprite.setTexture("personajes", 46);
    }
  }
}
