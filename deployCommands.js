const fs = require("fs")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { clientId, token, devGuildId } = require("./config.json")

const commands = []

const commandFolders = fs.readdirSync("./commands")

commandFolders.forEach((folder) => {
    const commandFiles = fs.readdirSync(`./commands/${folder}`)

    commandFiles.forEach((file) => {
        const command = require(`./commands/${folder}/${file}`)
        commands.push(command.data.toJSON())
    })
})

const contextMenuFiles = fs.readdirSync("./contextMenus")

contextMenuFiles.forEach((contextMenuFile) => {
    const contextMenu = require(`./contextMenus/${contextMenuFile}`)
    commands.push(contextMenu.data.toJSON())
})

const rest = new REST({ version: "9" }).setToken(token)

rest.put(
    devGuildId
        ? Routes.applicationGuildCommands(clientId, devGuildId)
        : Routes.applicationCommands(clientId),
    { body: commands }
)
    .then(() =>
        console.log(
            `Deployed all application commands to ${
                devGuildId ? `test server (${devGuildId})` : "all servers"
            }.`
        )
    )
    .catch(console.error)
