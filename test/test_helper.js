global.should = require('should');
global.sinon = require('sinon');
global.mongo = require('mongoose');

global.mongo.connect('mongodb://localhost/proto-test');