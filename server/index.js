'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    logger = require('morgan'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    appDAO = require('./dao'),
    Authenticator = require('./authenticator'),
    messages = require('./messages'),
    secret = 'learning-node-js';

module.exports = function () {
    let server = express(),
        create,
        start;

    create = function () {
        server.set('env', 'local');
        server.set('port', '4000');
        server.set('hostname', 'localhost');

        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(cookieParser());
        server.use(logger('dev'));
        server.use(passport.initialize())
        const dao = new appDAO('./server/db.sqlite3')
        const authenticator = new Authenticator(dao)
        server.use('/api/register', function (req, res) {
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
                            var token = jwt.sign(payload, secret, { expiresIn: '2 days' })
                            return res.json({ success: true, token: 'JWT ' + token })
                        }
                        return res.json({ success: false })
                    })
                    .catch(err => res.json(err))
            }

        })

        server.use('/api/login', function (req, res) {
            let { email, password } = req.body
            if (!email || !password) {
                throw messages.onValidationError
            } else {
                authenticator.getUserByEmailid(email)
                    .then((user) => {
                        if (user.id && user.emailId) {
                            console.log(user)
                            bcrypt.compare(password, user.password)
                                .then(match => {
                                    if (match) {
                                        let payload = { name: user.name, email: user.emailId, id: user.id }
                                        var token = jwt.sign(payload, secret, { expiresIn: '2 days' })
                                        return res.json({ success: true, token: 'JWT ' + token })
                                    } else {
                                        return res.json(messages.wrongCredentials)
                                    }
                                })
                        }
                    })
                    .catch(err => res.json(err))
            }
        })
    };

    start = function () {
        let hostname = server.get('hostname'),
            port = server.get('port');
        server.listen(port, function () {
            console.log('Express server listening on - http://' + hostname + ':' + port);
        });
    };
    return {
        create: create,
        start: start
    };
}();