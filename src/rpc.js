const RPC = require('discord-rpc')
const client = new RPC.Client({ transport: 'ipc' })


const setRPC = async (c, details) => {
    await c.setActivity(details)
}

const initiateRPC = async () => {
    await client.login({ clientId: "978118830318559252" })
        .catch(error => console.log(error))
    return client
}


module.exports = {
    setRPC,
    initiateRPC
}