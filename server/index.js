'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  logger = require('morgan'),
  dao = require('./dao'),
  user = require('./User'),
  config = require('./config');

const server = function () {
  let server = express(),
    create,
    start;

  create = function () {
    server.set('env', config.env);
    server.set('port', config.port);
    server.set('hostname', config.hostname);

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(cookieParser());
    server.use(logger('dev'));
    server.use(passport.initialize())
    dao.connect(config.dbFile)
    server.use('/api/register', user.register)
    server.use('/api/login', user.login)
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
server.create();
server.start();