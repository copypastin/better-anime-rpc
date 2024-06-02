const RPC = require('discord-rpc')
const client = new RPC.Client({ transport: 'ipc' })

const setRPC = async (client, details) => {
    await client.setActivity(details)
}

const initiateRPC = async () => {
    await client.login({ clientId: "978118830318559252" })
    return client
}

module.exports = {
    setRPC,
    initiateRPC
}