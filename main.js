const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.guilds.cache.forEach(server => {
        //var welcomeChannel = server.
    })
})

client.on('message', msg => {
    //command: !setup
    //!stuff parameter

    var command = msg.content.split(' ')
    //return command[] = {!stuff, parameter}

    switch (command[0]) {
        case '!setup':
            break
        case '!help':
            //send rich message with bot usages
            //msg.reply(embed)
            break
        default:
            break
    }
})

client.login('ODE1MjkwNDg3ODc1NDM2NTc2.YDqQbw.M8jUAUhHMHOT2rZ0M2aMt7fl_GY')