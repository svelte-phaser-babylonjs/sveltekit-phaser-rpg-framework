import { Direction } from "$lib/phaser/types";
import Player from ".";

export default class PlayerContainer extends Phaser.GameObjects.Container {
    private player!: Player;
    private weapon!: Phaser.GameObjects.Image;
    private velocity!: number;
    private currentDirection: Direction;
    private isAttacking: boolean;
    private flipX: boolean;
    private swordHit: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame: string | number) {
        super(scene, x, y);

        // store a reference to the scene
        this.scene = scene;
        this.velocity = 160; // the velocity player container is moving

        this.currentDirection = Direction.RIGHT;
        this.isAttacking = false;
        this.flipX = true;
        this.swordHit = false;

        // set a size on the container
        this.setSize(64, 64);

        // enable physics
        this.scene.physics.world.enable(this);

        // collide with world bounds
        this.getBody().setCollideWorldBounds(true);

        // add the player container to the existing scene
        this.scene.add.existing(this);

        // have the camera follow the player container
        this.scene.cameras.main.startFollow(this);

        // create the player
        this.player = new Player(this.scene, 0, 0, texture, frame);
        this.add(this.player);

        // create the weapon game object
        this.weapon = this.scene.add.image(40, 0, 'items', 4);
        this.scene.add.existing(this.weapon);
        this.weapon.setScale(1.5);
        this.scene.physics.world.enable(this.weapon);
        this.add(this.weapon);
        this.weapon.alpha = 0;

    }

    getBody(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.getBody().setVelocity(0);

        if (cursors.left.isDown) {
            this.getBody().setVelocityX(-this.velocity);
            this.currentDirection = Direction.LEFT;
            this.weapon.setPosition(-40, 0);
        } else if (cursors.right.isDown) {
            this.getBody().setVelocityX(this.velocity);
            this.currentDirection = Direction.RIGHT;
            this.weapon.setPosition(40, 0);
        }

        if (cursors.up.isDown) {
            this.getBody().setVelocityY(-this.velocity);
            this.currentDirection = Direction.UP;
            this.weapon.setPosition(0, -40);
        } else if (cursors.down.isDown) {
            this.getBody().setVelocityY(this.velocity);
            this.currentDirection = Direction.DOWN;
            this.weapon.setPosition(0, 40);
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.isAttacking) {
            this.weapon.alpha = 1;
            this.isAttacking = true;

            this.scene.time.delayedCall(150, () => {
                this.weapon.alpha = 0;
                this.isAttacking = false;
                this.swordHit = false;
            }, [], this);
        }

        if (this.isAttacking) {
            if (this.weapon.flipX) {
                this.weapon.angle -= 2;
            } else {
                this.weapon.angle += 2;
            }
        } else {
            if (this.currentDirection === Direction.DOWN) {
                this.weapon.setAngle(-270);
            } else if (this.currentDirection === Direction.UP) {
                this.weapon.setAngle(-90);
            } else {
                this.weapon.setAngle(0);
            }

            this.weapon.flipX = false;
            if (this.currentDirection === Direction.LEFT) {
                this.weapon.flipX = true;
            }
        }
    }
}