const db = require("../helpers/database.js")
const end = require("../helpers/end.js")
module.exports = {
    name: "ready",
    once: true,
    execute: async (client) => {
        client.user.setActivity("for /giveaway", { type: "WATCHING" })
        console.log(`Ready! Logged in as ${client.user.tag}`)
        try {
            await db.Sequelize.authenticate()
            console.log("Connection has been established successfully.")
        } catch (error) {
            console.error("Unable to connect to the database:", error)
        }

        await db.Sequelize.sync()

        const giveaways = await db.Giveaways.findAll({
            where: { isFinished: false },
        })

        giveaways.forEach((giveaway) => end(giveaway, client))
    },
}
