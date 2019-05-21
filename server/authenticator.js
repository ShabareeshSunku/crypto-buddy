const dao = require('./dao')
class Authenticator {
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name Text,
          emailId TEXT,
          password Text)`
        return dao.run(sql)
    }

    create(name, emailId, password) {
        this.createTable()
        return dao.run(`
        INSERT INTO users (name, emailId, password)
        VALUES (?,?,?)`, [name, emailId, password])
    }
    getUserByEmailid(emailId) {
        return dao.get(`
        SELECT * FROM users WHERE emailid=?
        `, [emailId])
    }
    getUserById(id) {
        return dao.get(`
        SELECT * FROM users WHERE id=?
        `, [id])
    }
    getAll(emailId) {
        return dao.all(`
        SELECT * FROM users`)
    }
}

module.exports = new Authenticator()