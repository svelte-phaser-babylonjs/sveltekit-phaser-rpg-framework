export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        // add stuff to load here 👇
        const loaders: (() => void)[] = [
            () => {
                // load images
                this.loadImages();

                // load spritesheets
                this.loadSpriteSheets();

                // load sounds
                this.loadSounds();

                // load tilemap
                this.loadTileMap();
            }
        ];

        this.loadAndSendUpdates(loaders);
    }

    private loadImages() {
        this.load.image('button1', 'assets/images/ui/blue_button01.png');
        this.load.image('button2', 'assets/images/ui/blue_button02.png');

        // load the map tileset image
        this.load.image('background', 'assets/level/background-extruded.png');
    }

    private loadSpriteSheets() {
        this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('monsters', 'assets/images/monsters.png', { frameWidth: 32, frameHeight: 32 });
    }

    private loadSounds() {
        this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
        this.load.audio('enemyDeath', ['assets/audio/EnemyDeath.wav']);
        this.load.audio('playerAttack', ['assets/audio/PlayerAttack.wav']);
        this.load.audio('playerDamage', ['assets/audio/PlayerDamage.wav']);
        this.load.audio('playerDeath', ['assets/audio/PlayerDeath.wav']);
    }

    private loadTileMap() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'assets/level/large_level.json');
    }

    private loadAndSendUpdates(preloadList: (() => void)[]) {
        const totalToLoad = preloadList.length;
        let loadedCount = 0;

        // Listen for the 'filecomplete' event and update the progress
        this.load.on('filecomplete', () => {
            loadedCount++;
            const percentageComplete = loadedCount / totalToLoad;
            this.scene.get('splash').events.emit('set_loader_progress', percentageComplete);
        });

        // Trigger the load process
        preloadList.forEach((load) => load());
    }

    create() {
        this.scene.get('splash').events.emit('set_loader_progress', 1);
        this.time.delayedCall(50, () => {
            this.scene.stop('splash');
            this.scene.start('title');
        });
    }
}
