const {app, BrowserWindow} = require('electron')
const { getInfoFromName } = require("./helpers/mal-info")
const {setRPC, initiateRPC } = require("./rpc")
const URL = "https://anix.to/home"
let client;
let RPCDetails;

let lastURL;
let lastTimeStamp
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
            if (currentURL !== "https://anix.to/home" && lastURL !== currentURL) {

                let title = currentURL.toString().split("/")[4].split("-").slice(0, -1).join(" ")
                let ep = currentURL.split("ep-")[1]
                lastURL = currentURL;
                lastTimeStamp = new Date().getTime()
                const data = await getInfoFromName(title.replace(/[0-9]/g, ''));

                console.log(`${title} ${currentURL}`)
                let description = () => {
                    if (currentURL.indexOf("ep-") > -1) return `Episode ${ep}`
                    else return `Episode ?`
                };

                lastTitle = data.title

                RPCDetails = {
                    details: `Watching ${data.title}`,
                    largeImageKey: data.picture,
                    largeImageText: data.genres.join(", "),
                    state: description(),
                    instance: true,
                    buttons: [{
                        label: `${data.popularity} in Popularity`,
                        url: `${data.url}`
                    }, {label: `${data.ranked} in Ratings`, url: `${data.url}/stats`}],
                    startTimestamp: lastTimeStamp
                }

                win.setTitle(`Anime Tracker | Watching ${data.title}`)

            } else if (currentURL === "https://anix.to/home" && lastURL !== currentURL) {
                lastURL = "https://anix.to/home"
                lastTitle = "Main Menu";
                lastTitle = undefined;
                lastTimeStamp = null;
                win.setTitle("Anime Tracker | Main Menu")


                RPCDetails = {
                    details: 'Main Menu',
                    largeImageKey: 'https://cdn.frankerfacez.com/emoticon/517943/4',
                    largeImageText: 'aaron was here',
                    state: 'Browsing Anime',
                    instance: true,
                    buttons: [{label: `Github Repo`, url: `https://github.com/copypastin/barpc`}]
                }
            }

            if(RPCDetails !== undefined) {
                await setRPC(client, RPCDetails)
                RPCDetails = undefined
            }

        }, 5E3); // 5 seconds
    })
})();


