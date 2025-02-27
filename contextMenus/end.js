const { ContextMenuCommandBuilder } = require("@discordjs/builders")
const { ApplicationCommandType } = require("discord-api-types/v9")
const db = require("../helpers/database.js")
const end = require("../helpers/end")

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("End Giveaway")
        .setType(ApplicationCommandType.Message),
    execute: async (interaction) => {
        const giveaway = await db.Giveaways.findOne({
            where: {
                messageId: interaction.targetId,
            },
        })

        if (!giveaway)
            return await interaction.reply({
                content: "That message is not a giveaway.",
                ephemeral: true,
            })

        if (interaction.user.id != giveaway.userId)
            return await interaction.reply({
                content: "You are not the giveaway hoster.",
                ephemeral: true,
            })

        if (giveaway.isFinished)
            return await interaction.reply({
                content: "The giveaway has already ended.",
                ephemeral: true,
            })

        end(giveaway, interaction.client, true)

        await interaction.reply({
            content: "Giveaway Ended.",
            ephemeral: true,
        })
    },
}
