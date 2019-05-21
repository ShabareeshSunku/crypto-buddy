class Authenticator {
    constructor(dao) {
        this.dao = dao
        this.createTable()
    }
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name Text,
          emailId TEXT,
          password Text)`
        return this.dao.run(sql)
    }

    create(name, emailId, password) {
        return this.dao.run(`
        INSERT INTO users (name, emailId, password)
        VALUES (?,?,?)`, [name, emailId, password])
    }
    getUserByEmailid(emailId) {
        return this.dao.get(`
        SELECT * FROM users WHERE emailid=?
        `, [emailId])
    }
    getUserById(id) {
        return this.dao.get(`
        SELECT * FROM users WHERE id=?
        `, [id])
    }
    getAll(emailId){
        return this.dao.all(`
        SELECT * FROM users`)
    }
}

module.exports = Authenticator