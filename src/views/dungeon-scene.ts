import Player from "../models/player";
import Dungeon from "@mikewesthad/dungeon";
import TILES from "../models/tile-mapping";

/**
 * Crear escena de la dungeon
 */
export default class DungeonScene extends Phaser.Scene {
  
  dungeon: Dungeon;
  capaPrincipal: Phaser.Tilemaps.TilemapLayer;
  capaObjetos: Phaser.Tilemaps.TilemapLayer;
  player: Player;

  preload() {
    this.load.image("tiles", "../assets/tilesets/buch-tileset-48px-extruded.png");
    this.load.spritesheet(
      "personajes",
      "../assets/spritesheets/buch-characters-64px-extruded.png",
      {
        frameWidth: 64,
        frameHeight: 64,
        margin: 1,
        spacing: 2,
      }
    );
  }

  create() {
    // Generar la dungeon de forma aleatoria:
    this.dungeon = new Dungeon({
      width: 50,
      height: 50,
      doorPadding: 2,
      rooms: {
        width: { min: 9, max: 19, onlyOdd: true },
        height: { min: 7, max: 15, onlyOdd: true },
      },
    });

    // Crear la plantilla donde estará la dungeon
    const map = this.make.tilemap({
      tileWidth: 48,
      tileHeight: 48,
      width: this.dungeon.width,
      height: this.dungeon.height,
    });
    
    const tileset = map.addTilesetImage("tiles", undefined, 48, 48, 1, 2);
    this.capaPrincipal = map.createBlankLayer("Ground", tileset);
    this.capaObjetos = map.createBlankLayer("Stuff", tileset);

    this.capaPrincipal.fill(TILES.BLANK);

    // Crear las habitaciones
    this.dungeon.rooms.forEach((room) => {
      const { x, y, width, height, left, right, top, bottom } = room;

      // Suelo
      this.capaPrincipal.weightedRandomize(TILES.FLOOR, x + 1, y + 1, width - 2, height - 2);

      // Esquinas
      this.capaPrincipal.putTileAt(TILES.WALL.TOP_LEFT, left, top);
      this.capaPrincipal.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
      this.capaPrincipal.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
      this.capaPrincipal.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

      // Paredes
      this.capaPrincipal.weightedRandomize(TILES.WALL.TOP, left + 1, top, width - 2, 1);
      this.capaPrincipal.weightedRandomize(TILES.WALL.BOTTOM, left + 1, bottom, width - 2, 1);
      this.capaPrincipal.weightedRandomize(TILES.WALL.LEFT, left, top + 1, 1, height - 2);
      this.capaPrincipal.weightedRandomize(TILES.WALL.RIGHT, right, top + 1, 1, height - 2);

      // Puertas
      const puertas = room.getDoorLocations();
      for (let i = 0; i < puertas.length; i++) {
        if (puertas[i].y === 0) {
          this.capaPrincipal.putTilesAt(TILES.DOOR.TOP, x + puertas[i].x - 1, y + puertas[i].y);
        } else if (puertas[i].y === room.height - 1) {
          this.capaPrincipal.putTilesAt(TILES.DOOR.BOTTOM, x + puertas[i].x - 1, y + puertas[i].y);
        } else if (puertas[i].x === 0) {
          this.capaPrincipal.putTilesAt(TILES.DOOR.LEFT, x + puertas[i].x, y + puertas[i].y - 1);
        } else if (puertas[i].x === room.width - 1) {
          this.capaPrincipal.putTilesAt(TILES.DOOR.RIGHT, x + puertas[i].x, y + puertas[i].y - 1);
        }
      }
    });

    // Indicar los elementos con los que se puede colisionar.
    this.capaPrincipal.setCollisionByExclusion([-1, 6, 7, 8, 26]);

    // Indicar el punto de spawneo del jugador
    this.player = new Player(this, map.widthInPixels / 2, map.heightInPixels / 2);

    // Añadir las colisiones
    this.physics.add.collider(this.player.sprite, this.capaPrincipal);

    //Camara
    const camara = this.cameras.main;
    camara.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camara.startFollow(this.player.sprite);
  }

  update(_time: any, _delta: any) {
    this.player.update();
  }
}
