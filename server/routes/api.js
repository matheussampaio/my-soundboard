const express = require('express');
const router = express.Router();

const Script = require('../models/script');
const Audio = require('../models/audio');
const AudioData = require('../models/audio-data');

module.exports = function (app) {
  Script.register(app, '/api/script');
  Audio.register(app, '/api/audio');
  AudioData.register(app, '/api/audiodata');

  return router;
};
