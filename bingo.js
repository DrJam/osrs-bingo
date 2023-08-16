const fs = require('fs');
// const config = require('./config/config_goblin.json');
const config = require('./config/config_dt2.json');
// const config = require('./config/config_base.json');
const { cleanupTemp, cleanupOutput } = require('./fileEditing.js');
const { buildTileImage, combineTiles } = require('./imageGeneration.js');
const { balanceListBoard } = require('./boardBalancing.js');

const buildTileImages = (tiles, player) => {
    let buildImages = [];
    buildImages.push(buildTileImage(config.center, 'center', player));
    tiles.forEach((tile, index) => {
        buildImages.push(buildTileImage(tile, index, player));
    });
    return buildImages;
}

const buildOneBoard = (player, newConfig) => {
    let baseTiles = config.tiles.slice(0, config.size * config.size);

    let tiles;
    if (player.tiles) {
        tiles = player.tiles;
    } else {
        tiles = baseTiles.slice()
        tiles.sort(() => Math.random() - 0.5);
        let board = {
            size: config.size,
            center: config.center,
            tiles: tiles
        }
        board = balanceListBoard(board);
        tiles = board.tiles;
    }

    newConfig.players.push({ name: player.name, tiles: tiles })

    let buildImages = buildTileImages(tiles, player);
    return Promise.allSettled(buildImages)
        .then(() => {
            return combineTiles(config.size, player)
        });
}

const buildAllBoards = (players) => {
    let promises = [];

    let newConfig = {
        size: config.size,
        center: config.center,
        tiles: config.tiles,
        players: []
    }

    players.forEach((player) => {
        promises.push(buildOneBoard(player, newConfig));
    });

    return Promise.allSettled(promises).then((result) => {
        fs.writeFileSync(`output/config.json`, JSON.stringify(newConfig, null, 2));
    });
}

cleanupOutput();
buildAllBoards(config.players).then(() => {
    cleanupTemp();
});
