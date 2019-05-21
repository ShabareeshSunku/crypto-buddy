const authenticator = require('./authenticator'),
  messages = require('./messages'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  config = require('./config');

function register(req, res) {
  let { email, password, name } = req.body
  if (!email || !password || !name) {
    throw messages.onValidationError
  } else {
    authenticator.getUserByEmailid(email)
      .then((user = {}) => {
        if (user.id) {
          throw messages.duplicateEmail
        } else {
          return bcrypt.hash(password, 10)
        }
      })
      .then((hash) => authenticator.create(name, email, hash))
      .then((id) => authenticator.getUserById(id))
      .then((user) => {
        if (user.id && user.emailId) {
          let payload = { name: user.name, email: user.emailId, id: user.id }
          var token = jwt.sign(payload, config.secret, { expiresIn: '2 days' })
          return res.json({ success: true, token: 'JWT ' + token })
        }
        return res.json({ success: false })
      })
      .catch(err => res.json(err))
  }
}

function login(req, res) {
  let { email, password } = req.body
  if (!email || !password) {
    throw messages.onValidationError
  } else {
    authenticator.getUserByEmailid(email)
      .then((user) => {
        if (user.id && user.emailId) {
          bcrypt.compare(password, user.password)
            .then(match => {
              if (match) {
                let payload = { name: user.name, email: user.emailId, id: user.id }
                var token = jwt.sign(payload, config.secret, { expiresIn: '2 days' })
                return res.json({ success: true, token: 'JWT ' + token })
              } else {
                return res.json(messages.wrongCredentials)
              }
            })
        }
      })
      .catch(err => res.json(err))
  }
}

module.exports = {
  register,
  login
}