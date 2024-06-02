const { app, BrowserWindow, Notification } = require('electron')
const { getInfoFromName } = require("./helpers/mal-info")
const { setRPC, initiateRPC } = require("./helpers/rpc")
const URL = "https://anix.to/"

let client;
let RPCDetails;
let lastURL;
let lastTitle;

app.whenReady().then(() => {
    let window = new BrowserWindow({
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

    window.loadURL(URL)
        .then(async () => {
            window.setTitle("Anime Tracker")
            client = await initiateRPC()
        })

    //POPUP BLOCKER 
    window.webContents.setWindowOpenHandler(() => {
        console.log('popup denied')
        return { action: "deny" };
    });

    // Updates RPC
    setInterval(async () => {
        const currentURL = window.webContents.getURL();

        // Prevents RPC from constantly trying to update
        if (lastURL == currentURL) return;


        // Check if user is on a different page that is also not the URl
        if (currentURL !== URL) {
            let data;

            try {
                let obfsuTitle = currentURL.toString().split("/")[4].split("-").slice(0, -1).join(" ")
                data = await getInfoFromName(obfsuTitle.replace(/[0-9]/g, ''));
            } catch (err) {
                window.loadURL(URL)
                new Notification({
                    title: "BARPC | Something went wrong!",
                    body: "Page was reloaded for your convience."
                }).show()
            }

            lastURL = currentURL;
            lastTitle = data.title

            RPCDetails = {
                details: `Watching ${data.title}`,
                largeImageKey: data.picture,
                largeImageText: data.genres.join(", "),
                state: `Episode ${currentURL.split("ep-")[1]}` ?? `Episode ?`,
                instance: true,
                buttons: [{
                    label: `${data.popularity} in Popularity`, url: `${data.url}`
                }, { label: `${data.ranked} in Ratings`, url: `${data.url}/stats` }],
                startTimestamp: new Date().getTime()
            }

            window.setTitle(`Anime Tracker | Watching ${data.title}`)

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
                buttons: [{ label: `Github Repo`, url: `https://github.com/copypastin/better-anime-rpc` }]
            }

            window.setTitle("Anime Tracker | Main Menu")
        }

        await setRPC(client, RPCDetails)


    }, 5E3); // 5 seconds
})


