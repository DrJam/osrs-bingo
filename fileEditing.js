const fs = require('fs');

module.exports = {
    cleanupTemp: () => {
        if (fs.existsSync('temp')) {
            fs.rm('temp', { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
    },

    cleanupOutput: () => {
        if (fs.existsSync('output')) {
            fs.rmSync('output', { recursive: true })
        }
        fs.mkdirSync('output')
    }
}