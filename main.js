const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.guilds.cache.forEach(server => {
        let welcomeChannel = server.channels.cache.find(chnl => chnl.name === 'welcome' && chnl.type === 'text')

        if (welcomeChannel) {
            welcomeChannel.messages.fetch({ limit: 1 })
            .then(messages => {
                let lastMsg = messages.first()

                if (!lastMsg.author.bot) {
                    let roleEmbed = new Discord.MessageEmbed({
                        color: '#e87500',
                        description: 'Hello! Before you can view the server, you need to enter your name and select your pronouns. Please type your name and then react to your preferred pronouns.\n:one: - she/her\n:two: - he/him\n:three: - they/them\n:four: - they/she\n:five: - they/him\n:six: - any',
                        
                    })
                    welcomeChannel.send(roleEmbed)
                    .then(msg => {
                        //msg.react()
                    }).catch(console.error)
                }         
                else
                    console.log('bad')

            }).catch(console.error)
        }
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
            msg.reply('test')
            break
        default:
            break
    }
})

client.login('ODE1MjkwNDg3ODc1NDM2NTc2.YDqQbw.M8jUAUhHMHOT2rZ0M2aMt7fl_GY')