const Jimp = require('jimp');
const images = require('./images/images.json');

const addIcon = (tile, image) => {
    return Jimp.read(`images/icons/${tile.icon}`).then(icon => {
        let iconX = images.clog.iconCenterX;
        let iconY = images.clog.iconCenterY;
        let iconWidth = icon.bitmap.width;
        let iconHeight = icon.bitmap.height;
        if (iconHeight > images.clog.iconMaxHeight) {
            iconWidth = Math.floor(iconWidth * images.clog.iconMaxHeight / iconHeight);
            iconHeight = images.clog.iconMaxHeight;
        }
        let resizedIcon = icon.resize(iconWidth, iconHeight)
        iconX -= resizedIcon.bitmap.width / 2;
        iconY -= resizedIcon.bitmap.height / 2;
        return image.composite(resizedIcon, iconX, iconY);
    })
};

const addName = (image, name) => {
    return Jimp.loadFont('./font/runescape_uf_28.fnt').then(font => {
        image.print(
            font, 0, images.composite.marginTop / 2 - 14,
            { text: name, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_TOP },
            image.bitmap.width,
        )
    });
};


module.exports = {
    buildTileImage: (tile, fileName, player) => {
        return Jimp.read('images/clog.png').then(baseImage => {
            return Jimp.loadFont('./font/runescape_uf_14.fnt').then(font => {
                let printBonusTextAndSave = () => {
                    baseImage.print(font, images.clog.marginSide, images.clog.height - images.clog.marginTop - 14,
                        { text: tile.note, alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT, alignmentY: Jimp.VERTICAL_ALIGN_TOP },
                        images.clog.width - 2 * images.clog.marginSide
                    )
                    return baseImage.writeAsync(`temp/${player.name}_${fileName}.png`)
                }

                baseImage.print(font, images.clog.marginSide, images.clog.marginTop,
                    { text: tile.name, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_TOP },
                    images.clog.width - 2 * images.clog.marginSide
                )

                if (tile.icon) {
                    return addIcon(tile, baseImage).then(() => {
                        return printBonusTextAndSave();
                    });
                }
                return printBonusTextAndSave();

            });
        });
    },

    combineTiles: (size, player) => {
        let tiles = [
            ['0.png', '1.png', '2.png', '3.png', '4.png'],
            ['5.png', '6.png', '7.png', '8.png', '9.png'],
            ['10.png', '11.png', 'center.png', '12.png', '13.png'],
            ['14.png', '15.png', '16.png', '17.png', '18.png'],
            ['19.png', '20.png', '21.png', '22.png', '23.png']
        ];
        let imgWidth = images.clog.width;
        let imgHeight = images.clog.height;

        let combinedImage = new Jimp(imgWidth * size, imgHeight * size + images.composite.marginTop);

        let promises = [];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let promise = Jimp.read(`temp/${player.name}_${tiles[i][j]}`).then(img => {
                    combinedImage.composite(img, j * imgWidth, images.composite.marginTop + i * imgHeight);
                });
                promises.push(promise);
            }
        }

        return Promise.allSettled(promises)
            .then(() => {
                return addName(combinedImage, player.name)
            })
            .then(() => {
                return combinedImage.writeAsync(`output/${player.name}.png`);
            });
    }
};