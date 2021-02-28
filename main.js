const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const CockroachDB = require('./database')

const monitorTimeout = 30000
const days = ['s', 'm', 't', 'w', 'th', 'f', 'sat']

let db = new CockroachDB()

let welcomeChannels = {
    //template vvv
    'guildId': 'channelId',
}

let roles = {
    '1️⃣': 'she/her',
    '2️⃣': 'he/him',
    '3️⃣': 'they/them',
    '4️⃣': 'they/she',
    '5️⃣': 'they/him',
    '6️⃣': 'any'
}

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch()
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error)
			return
		}
	}

    const guild = reaction.message.guild

    if (welcomeChannels[guild.id] === reaction.message.channel.id) {
        if (roles[reaction.emoji.name]) {            
            const member = await guild.members.fetch(user.id)
            const role = await guild.roles.cache.find(role => role.name === roles[reaction.emoji.name])

            if (role)
                await member.roles.add(role)
        }
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.partial) {
		try {
			await reaction.fetch()
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error)
			return
		}
	}

    const guild = reaction.message.guild

    if (welcomeChannels[guild.id] === reaction.message.channel.id) {
        if (roles[reaction.emoji.name]) {            
            const member = await guild.members.fetch(user.id)
            const role = await guild.roles.cache.find(role => role.name === roles[reaction.emoji.name])

            if (role)
                await member.roles.remove(role)
        }
    }
})

function monitor(server) {
    if (server) {
        let notifChannel = server.channels.cache.find(chnl => chnl.name == 'alert-notifs')

        if (notifChannel) {
            let date = new Date()
            let currentDay = days[date.getDay()]
            db.getLecture(server.id, (lecture) => {
                if (lecture.days.includes(currentDay)) {
                    let lectureTime = lecture.time.split(':')
                    let timeLeft = ((parseInt(lectureTime[0]) * 60) + (parseInt(lectureTime[1]))) - ((date.getHours() * 60) + (date.getMinutes()) + (date.getSeconds() / 60))
                    
                    if (timeLeft <= 10.5 && timeLeft > 10) {
                        const alertEmbed = new Discord.MessageEmbed()
                        .setColor('FF3300')
                        .setTitle('~Lecture Alert~')
                        .setDescription('This lecture starts in 10 minutes, please join soon.')

                        notifChannel.send(alertEmbed)
                    }
                        
                }
            })

            let now = Date.now()
            db.getAssignments(server.id, (assignments) => {
                assignments.forEach(assignment => {
                    let timeLeft = assignment.due_date - now
                    const alertEmbed = new Discord.MessageEmbed()
                        .setColor('FF3300')
                        .setTitle('~Upcoming Deadline~')
                    
                    if (timeLeft <= (2.592e+8 + monitorTimeout) && timeLeft > 2.592e+8) {
                        alertEmbed.addField(assignment.name, 'Due in 3 days.')
                        notifChannel.send(alertEmbed)
                    }
                    else if (timeLeft <= (8.64e+7 + monitorTimeout) && timeLeft > 8.64e+7) {
                        alertEmbed.addField(assignment.name, 'Due in 1 day.')
                        notifChannel.send(alertEmbed)
                    }
                    else if (timeLeft <= (4.32e+7 + monitorTimeout) && timeLeft > 4.32e+7) {
                        alertEmbed.addField(assignment.name, 'Due in 12 hours!')
                        notifChannel.send(alertEmbed)
                    }
                    else if (timeLeft <= (2.16e+7 + monitorTimeout) && timeLeft > 2.16e+7) {
                        alertEmbed.addField(assignment.name, 'Due in 6 hours!!')
                        notifChannel.send(alertEmbed)
                    }
                    else if (timeLeft <= (3.6e+6 + monitorTimeout) && timeLeft > 3.6e+6) {
                        alertEmbed.addField(assignment.name, 'Due in 1 hour!!!')
                        notifChannel.send(alertEmbed)
                    }
                })
            })
        }
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.guilds.cache.forEach(async (server) => {
        try {
            monitor(server)
            setInterval(monitor, monitorTimeout, server)

            let welcomeChannel = server.channels.cache.find(chnl => chnl.name === 'welcome' && chnl.type === 'text')

            if (welcomeChannel) {
                let messages = await welcomeChannel.messages.fetch({ limit: 1 })
                let lastMsg = messages.first()

                welcomeChannels[server.id] = welcomeChannel.id
    
                if (!lastMsg || !lastMsg.author.bot) {
                    let roleEmbed = new Discord.MessageEmbed({
                        color: '#e87500',
                        description: 'Hello! Before you can view the server, you need to enter your name and select your pronouns. Please type your name and then react to your preferred pronouns.\n\n:one: - she/her\n:two: - he/him\n:three: - they/them\n:four: - they/she\n:five: - they/him\n:six: - any',
                    })
                    let msg = await welcomeChannel.send(roleEmbed)
                    await msg.react('1️⃣')
                    await msg.react('2️⃣')
                    await msg.react('3️⃣')
                    await msg.react('4️⃣')
                    await msg.react('5️⃣')
                    await msg.react('6️⃣')
                }         
            }
        } catch(err) {
            console.error(err)
        }
    })
})


client.on('message', msg => {
    //command: !setup
    //!stuff parameter
    var command = msg.content.split(' ')
    curses = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];
    var word
    for (var i = 0; i < command.length; i++) {
        word = command[i]
        for (var k = 0; k < curses.length; k++) {
            if (word == curses[k]){
                msg.delete();
                msg.reply('messages containing explict language will be deleted.')
            }
        }
    }

    if (welcomeChannels[msg.guild.id] === msg.channel.id && !msg.author.bot) {
        msg.member.setNickname(msg.content)
        .then(() => {
            msg.delete() 

            let studentRole = msg.guild.roles.cache.find(role => role.name === 'Student')
            msg.member.roles.add(studentRole)
        })
        .catch(console.error)
    }
    else {
        switch (command[0]) {
            case '!setup':
                break

            case '!help':
                //send rich message with bot usages
                const msgEmbed = new Discord.MessageEmbed()
                    .setColor('#e87500')
                    .setAuthor('TemocBot', 'https://www.utdallas.edu/about/files/temoc.png')
                    .setTitle('~How to use TemocBot~')
                    .setDescription('Useful Commands...\n')
                    .addFields(
                       // { name: '\u200B', value: '\u200B'}, 
                        { name: '!help:', value: 'See information about the commands' },
                        { name: '!change-pronouns:', value: 'Select a new pronoun', inline: true},
                        { name: '!assignments:', value: 'Retrieve deadline information for upcoming assignments'},
                        { name: '(not for students) !add-assignment:', value: 'Add an assignment deadline(\"assignment_name\" yyyy mm dd)', inline: true},
                        { name: '(not for students) !remove-assignment \"assignment_name\":', value: 'remove an assignment deadline from list'}
                        )
                    .setThumbnail('https://www.utdallas.edu/about/files/temoc.png')
                   msg.reply(msgEmbed)
                break

            case '!add-assignment' :
                let assignment = (msg.content.match(/\"(.*?)\"/))[1]
                let count = 1 + assignment.split(' ').length
                let dueDate = new Date(command[count], command[count + 1]-1, command[count + 2])
                dueDate.setTime(dueDate.getTime() + 86399000)
                db.addAssignment(msg.guild.id, assignment, dueDate, (err, res) => {
                    if (err && err.code == 23505)
                        msg.reply('there is already an assignment with the same name.')
                    else if (!err)
                        msg.reply(`succesfully added assignment '${assignment}'.`)
                })
                break

            case '!remove-assignment' :
                let name = (msg.content.match(/\"(.*?)\"/))[1]
                db.removeAssignment(msg.guild.id, name, (err, res) => {
                    if (err)
                        msg.reply('there was an issue removing this assignment, please try again.')
                    else if (res.rowCount == 0) 
                        msg.reply(`there was no assignment named '${name}', nothing was removed.`)
                    else 
                        msg.reply(`succesfully removed the assignment '${name}'.`)    
                })
                break    
            
            case '!assignments':
                db.getAssignments(msg.guild.id, (assignments) => {
                    if (assignments.length > 0) {
                        let assignmentFields = []
                        assignments.forEach(a => {
                            let date = new Date(Number(a.due_date))
                            assignmentFields.push({ name: a.name, value: `Due: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`, inline: true })
                        })
                        let assignmentEmbed = new Discord.MessageEmbed({
                            color: '#e87500',
                            title: 'Assignment List',
                            fields: assignmentFields
                        })
                        msg.reply(assignmentEmbed)
                    }
                    else
                        msg.reply('there are no assignments added yet!')
                })
                break

            case '!change-pronouns' :
                let role = msg.guild.roles.cache.find(role => role.name === command[1])
                if (role) {
                    msg.member.roles.cache.forEach((role) => {
                        if (Object.values(roles).includes(role.name)) {
                            msg.member.roles.remove(role)
                        }
                    })
                    msg.member.roles.add(role)
                }
                break

            case '!set-lecture':
                let days = command[1].substr(1, command[1].length-2).split(',')
                db.addLecture(msg.guild.id, days, convertTo24Hour(command[2]), (err, res) => {
                    if (err)
                        msg.reply('there was an issue setting the lecture, please try again.')
                    else
                        msg.reply('succesfully added the lecture date, students will now be notified before going live.')
                })
                break

            default:
                break
        }
    }
})

function convertTo24Hour(time) {
    var hours = parseInt((time.split(':'))[0]);
    if(time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
    if(time.indexOf('pm')  != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(am|pm)/, '') + ':00';
}

client.login('ODE1MjkwNDg3ODc1NDM2NTc2.YDqQbw.M8jUAUhHMHOT2rZ0M2aMt7fl_GY')