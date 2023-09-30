const fs = require('node:fs')

const watchedDir = 'analytics/watchTime.json'
const updateInterval = 5;

const updateWatched = async (title) => {
    if (title === undefined) return;

    const data = JSON.parse(await fs.readFileSync(watchedDir));

    if (data['data'][title] === undefined) data['data'][title] = 0;
    else data['data'][title] += updateInterval;

    const info = JSON.stringify(data, null, 4)
    fs.writeFile(watchedDir, info, 'utf8', function (err) {
        if (err) return console.log(err);
    });

    console.log(`File saved. \n${info}`);
}

const clearWatchTime = () => {

    const data = JSON.stringify({'created': new Date(),'data' : {}})

    fs.writeFile(watchedDir, data, 'utf8', function (err) {
        if (err) return console.log(err);
    });
}

clearWatchTime();

module.exports = { updateWatched }
