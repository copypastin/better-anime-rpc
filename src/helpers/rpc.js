const RPC = require('discord-rpc')
const client = new RPC.Client({ transport: 'ipc' })

const setRPC = async (client, details) => {
    console.log("Setting RPC");
    await client.setActivity(details);
}

const initiateRPC = async () => {
    console.log("Initiating RPC");
    await client.login({ clientId: "978118830318559252" });
    return client;
}

module.exports = {
    setRPC,
    initiateRPC
}