const sqlite = require('sqlite3')
class AppDAO {
    constructor(dbfilePath) {
        this.db = new sqlite.Database(dbfilePath, (err) => {
            if (err) {
                console.log('db connection error : ', err)
            } else {
                console.log('successfully connected')
            }
        })
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('error running the query : ', sql, err)
                    reject(err)
                } else {
                    resolve(this.lastID)
                }
            })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('error running the query : ', sql, err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, result) => {
                if (err) {
                    console.log('error running the query : ', sql, err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = AppDAO;