import type ChestModel from "../game_manager/ChestModel";

export default class Chest extends Phaser.Physics.Arcade.Image {
    public coins!: number;
    public id!: string;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame: string | number, model: ChestModel) {

        super(scene, x, y, texture, frame);

        // store a reference to the scene
        this.scene = scene;

        this.updateByModel(model);

        // enable phsyics
        this.scene.physics.world.enable(this);

        // add the chest to the existing scene
        this.scene.add.existing(this);

        // scate the chest game object
        this.setScale(2);
    }

    updateByModel(model: ChestModel) {
        this.coins = model.data.gold; // the amount of coins this chest contains
        this.id = model.id;
        this.setPosition(model.x * 2, model.y * 2);
    }

    makeActive() {
        this.setActive(true);
        this.setVisible(true);
        this.body!.checkCollision.none = false;
    }

    makeInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.body!.checkCollision.none = true;
    }
}