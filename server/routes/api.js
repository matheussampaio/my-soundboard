const express = require('express');
const router = express.Router();

const Audio = require('../models/audio');
const AudioData = require('../models/audio-data');

module.exports = function (app) {
  Audio.register(app, '/api/audio');
  AudioData.register(app, '/api/audiodata');

  return router;
};
