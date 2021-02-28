const Discord = require('discord.js')
const { monitorTimeout } = require('./main')
const days = ['s', 'm', 't', 'w', 'th', 'f', 'sat']

function monitor(db, server) {
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

module.exports = { monitor };