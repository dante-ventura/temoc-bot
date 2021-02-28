const { Client } = require('pg')
const fs = require('fs')

var config = {
    user: 'user',
    password: 'password',
    host: 'host',
    database: 'db',
    port: 26257,
    ssl: {
        ca: fs.readFileSync('./cc-ca.crt')
            .toString(),
    }
}

class db {
    constructor() {
        this.client = new Client(config)
        this.client.connect()
        .then(() => { console.log('Succesfully connected to the db...') })
        .catch(console.error)
    }

    getAssignments(guildId, callback) {
        this.client.query(`SELECT name, due_date FROM assignments WHERE guild_id='${guildId}';`, (err, res) => {
            if (err)
                console.error(err)
            else
                callback(res.rows)
        })
    }

    addAssignment(guildId, name, date, callback) {
        this.client.query(`INSERT INTO assignments VALUES (${guildId}, '${name}', ${date.getTime()});`, (err, res) => {
            if (err) {
                console.error(err)
                callback(err)
            }
            else
                callback(null, res)
        })
    }

    removeAssignment(guildId, name, callback) {
        this.client.query(`DELETE FROM assignments WHERE guild_id=${guildId} AND name='${name}';`, (err, res) => {
            if (err) {
                console.error(err)
                callback(err)
            }
            else 
                callback(null, res)
        })
    }

    addLecture(guildId, days, time, callback) {
        this.client.query(`DELETE FROM classes WHERE guild_id=${guildId};`, (err, res) => {
            if (err) {
                console.error(err)
                callback(err)
            }
            else {
                this.client.query(`INSERT INTO classes VALUES (${guildId}, ARRAY['${(days.join("','")).toLowerCase()}'], TIME '${time}');`, (err, res) => {
                    if (err) {
                        console.error(err)
                        callback(err)
                    }
                    else
                        callback(null, res)
                })
            }
        })
    }

    getLecture(guildId, callback) {
        this.client.query(`SELECT days, time FROM classes WHERE guild_id=${guildId}`, (err, res) => {
            if (err)
                console.error(err)
            else if (res.rowCount > 0)
                callback(res.rows[0])
        })
    }
}

module.exports = db