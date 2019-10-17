class LevelOne extends Phaser.Scene {
  constructor() {
    super("LevelOne");
  }

  create() {
    // Load Sounds
    this.sfx = {
      jumpSound: this.sound.add("jump"),
      coinSound: this.sound.add("coinSound")
    };

    // Loading Game
    // Adding First Background Sky
    this.sky = this.add.tileSprite(
      0,
      0,
      game.config.width,
      game.config.height,
      "sky"
    );
    // Setting Pivot Point (Left Corner)
    this.sky.setOrigin(0, 0);

    // Adding Second Background (Sides)
    this.sides = this.add.tileSprite(0, 0, 0, 0, "sides");
    // Setting Pivot Point (Left Corner)
    this.sides.setOrigin(0, 0);
    // Setting Scale
    this.sides.setScale(0.2, 0.2);

    // Add pinkMonster
    this.pinkMonster = this.physics.add.sprite(
      game.config.width / 2,
      game.config.height / 1.2,
      "pinkMonster"
    );
    // Create pinkMonster Animation (Idle)
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("pinkMonster"),
      frameRate: 20,
      repeat: -1
    });
    this.pinkMonster.play("idle");

    const defaultPosY = this.game.config.height / 1.1;
    const defaultPosX = this.game.config.width / 2;

    // Starting Platform
    this.startPlatform = this.physics.add.staticGroup();
    this.startPlatform
      .create(defaultPosX, defaultPosY, "grass")
      .setScale(0.2)
      .refreshBody();

    // Creating Random Platforms Group
    this.platforms = this.physics.add.staticGroup();
    // Adding all the platforms
    this.platforms
      .create(100, 620, "log")
      .setScale(0.2)
      .refreshBody();
    this.platforms
      .create(210, 550, "grass")
      .setScale(0.2)
      .refreshBody();
    this.platforms
      .create(130, 445, "log")
      .setScale(0.2)
      .refreshBody();
    this.platforms
      .create(100, 345, "log")
      .setScale(0.2)
      .refreshBody();
    this.platforms
      .create(220, 280, "log")
      .setScale(0.2)
      .refreshBody();
    this.platforms
      .create(130, 200, "grass")
      .setScale(0.2)
      .refreshBody();
    this.platforms
      .create(210, 100, "log")
      .setScale(0.2)
      .refreshBody();

    // Animating Each individual Coin
    this.anims.create({
      key: "spin",
      frames: this.anims.generateFrameNumbers("coins"),
      frameRate: 8,
      repeat: -1
    });

    // Groups

    // Creating Coin Group &  Setting Gravity To False
    this.coins = this.physics.add.group();
    this.coins.defaults.setAllowGravity = false;
    // Creating Coins For The Coin Group
    this.coins.create(100, 580, "coins").setScale(0.09);
    this.coins.create(125, 540, "coins").setScale(0.09);
    this.coins.create(150, 500, "coins").setScale(0.09);
    this.coins.create(100, 325, "coins").setScale(0.09);
    this.coins.create(210, 80, "coins").setScale(0.09);
    this.coins.children.iterate(child => {
      child.play("spin");
    });

    // Hearts Group
    this.hearts = this.physics.add.group({
      key: "life",
      // lives as the global variable
      repeat: gameData.lives - 1,
      setXY: { x: 75, y: 785, stepX: 28 }
    });

    this.hearts.children.iterate(function(child) {
      child.body.allowGravity = false;
    });

    // Adding Collision With Starting Platform
    this.physics.add.collider(this.pinkMonster, this.startPlatform);
    // Adding Collision With Platforms
    this.physics.add.collider(this.pinkMonster, this.platforms);

    // Key Inputs To Control The pinkMonster
    this.cursors = this.input.keyboard.createCursorKeys();

    // Checking for overlap
    this.physics.add.overlap(this.pinkMonster, this.coins, this.collectCoin);

    // Score
    scoreText = this.add.text(100, 0, "Score: " + score, {
      font: "20px",
      fill: "#000"
    });

    // Level Text
    levelText = this.add.text(162, 772, "Level 1", {
      font: "20px",
      fill: "#000"
    });
  }

  // Collect function
  collectCoin = (pinkMonster, coins) => {
    this.sfx.coinSound.play();
    coins.destroy();
    coinScore();
  };

  update() {
    // Keyboard Inputs
    // Left & Right Controls
    if (this.cursors.left.isDown) {
      this.pinkMonster.setVelocityX(-120);
      this.pinkMonster.anims.play("idle", true);
      this.pinkMonster.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.pinkMonster.setVelocityX(120);
      this.pinkMonster.anims.play("idle", true);
      this.pinkMonster.flipX = false;
    }

    // Jumping Controls
    if (this.cursors.space.isDown && this.pinkMonster.body.touching.down) {
      this.pinkMonster.setVelocityY(-500);
      // Adding Jump sound
      this.sfx.jumpSound.play();
    }

    // Destroy pinkMonster If pinkMoster Falls Off Screen & Reload Game
    if (this.pinkMonster.y > game.config.height) {
      score = 0;
      // Reseting pinkMonster position
      this.pinkMonster.body.reset(
        game.config.width / 2,
        game.config.height / 1.2,
        false,
        false
      );
      // Removing live when fall
      if (gameData.lives > 0) {
        gameData.lives -= 1;
        this.hearts.children.entries[gameData.lives].destroy();
        if (gameData.lives === 0) {
          game.scene.stop("LevelOne");
          game.scene.start("GameOver");
        }
      }
    }

    // If Player Reaches Top of Screen Load Next Level
    if (this.pinkMonster.y <= 0) {
      // Loads Level Two
      game.scene.start("LevelTwo");
      game.scene.stop("LevelOne");
    }
  }
}