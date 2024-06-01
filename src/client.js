const {app, BrowserWindow} = require('electron')
const { getInfoFromName } = require("./helpers/mal-info")
const {setRPC, initiateRPC } = require("./helpers/rpc")
const URL = "https://anix.to/"

let client;
let RPCDetails;
// let lastURL;
let lastTitle;

(async function () {
    app.whenReady().then(() => {
        let win = new BrowserWindow({
            backgroundColor: '#FFF',
            useContentSize: false,
            autoHideMenuBar: true,
            resizable: true,
            center: true,
            frame: true,
            alwaysOnTop: false,
            title: 'Anime Tracker',
            icon: __dirname + './assets/swagCat.png',
            webPreferences: {
                nodeIntegration: true,
                plugins: true,
            },
            nativeWindowOpen: true
        });

        win.loadURL(URL)
            .then(async () => {
                win.setTitle("Anime Tracker")
                client = await initiateRPC()
            })

        //POPUP BLOCKER 
        win.webContents.setWindowOpenHandler(() => {
            console.log('popup denied')
            return {action: "deny"};
        });

            // Updates RPC
        setInterval(async () => {
            const currentURL = win.webContents.getURL();

            // Prevents RPC from constantly trying to update
            if(lastURL == currentURL) return; 


            // Check if user is on a different page that is also not the URl
            if (currentURL !== URL) {
                let title = currentURL.toString().split("/")[4].split("-").slice(0, -1).join(" ")
                let ep = currentURL.split("ep-")[1]
                lastURL = currentURL;
                const data = await getInfoFromName(title.replace(/[0-9]/g, ''));

                lastTitle = data.title

                RPCDetails = {
                    details: `Watching ${data.title}`,
                    largeImageKey: data.picture,
                    largeImageText: data.genres.join(", "),
                    state: `Episode ${ep}` ?? `Episode ?`, 
                    instance: true,
                    buttons: [{
                        label: `${data.popularity} in Popularity`,
                        url: `${data.url}`
                    }, {label: `${data.ranked} in Ratings`, url: `${data.url}/stats`}],
                    startTimestamp: new Date().getTime()
                }

                win.setTitle(`Anime Tracker | Watching ${data.title}`)

                // Checking if the user is on the homepage
            } else if (currentURL === URL) {
                lastURL = URL
                lastTitle = "Main Menu";
                lastTitle = undefined;

                RPCDetails = {
                    details: 'Main Menu',
                    largeImageKey: 'https://cdn.frankerfacez.com/emoticon/517943/4',
                    largeImageText: 'aaron was here',
                    state: 'Browsing Anime',
                    instance: true,
                    buttons: [{label: `Github Repo`, url: `https://github.com/copypastin/better-anime-rpc`}]
                }

                win.setTitle("Anime Tracker | Main Menu")
            }

            await setRPC(client, RPCDetails)


        }, 5E3); // 5 seconds
    })
})();


