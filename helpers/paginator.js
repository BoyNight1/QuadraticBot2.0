const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js")
module.exports = async (
    interaction,
    pages,
    buttonList,
    pageName,
    timeout = 120000
) => {
    if (!pages) throw new Error("Pages are not given.")
    if (!buttonList) throw new Error("Buttons are not given.")
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
        throw new Error("Link buttons are not supported.")
    if (buttonList.length !== 2) throw new Error("Need two buttons.")

    let page = 0

    const button1 = new MessageButton(buttonList[0])
    if (page < 1) {
        button1.setDisabled(true)
    }
    const button2 = new MessageButton(buttonList[1])
    if (page + 2 > pages.length) {
        button2.setDisabled(true)
    }
    const row = new MessageActionRow().addComponents(button1, button2)

    const currentPage = await interaction.reply({
        embeds: [
            new MessageEmbed(pages[page]).setFooter(
                `${pageName} ${page + 1} / ${pages.length}`
            ),
        ],
        components: [row],
        content: null,
        ephemeral: true,
        fetchReply: true,
    })

    const filter = (i) =>
        i.customId === buttonList[0].customId ||
        i.customId === buttonList[1].customId

    const collector = await currentPage.createMessageComponentCollector({
        filter,
        time: timeout,
    })

    collector.on("collect", async (i) => {
        await i.deferUpdate()
        switch (i.customId) {
            case buttonList[0].customId:
                page = page > 0 ? --page : pages.length - 1
                break
            case buttonList[1].customId:
                page = page + 1 < pages.length ? ++page : 0
                break
            default:
                break
        }
        const button1 = new MessageButton(buttonList[0])
        if (page < 1) {
            button1.setDisabled(true)
        }
        const button2 = new MessageButton(buttonList[1])
        if (page + 2 > pages.length) {
            button2.setDisabled(true)
        }
        const newRow = new MessageActionRow().addComponents(button1, button2)
        await i.editReply({
            embeds: [
                new MessageEmbed(pages[page]).setFooter(
                    `${pageName} ${page + 1} / ${pages.length}`
                ),
            ],
            components: [newRow],
            content: null,
        })
        collector.resetTimer()
    })

    collector.on("end", () => {
        if (!currentPage.deleted) currentPage.delete()
    })

    return currentPage
}
