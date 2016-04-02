import Busboy from 'busboy';
import restful from 'node-restful';
import AudioData from './audio-data';

const mongoose = restful.mongoose;

const Audio = restful.model('audio', new restful.mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'audiodata',
    required: true
  },
  user: {
    type: String,
    required: true
  }
}))
.methods(['get', 'put', 'delete']);

Audio.route('post', (req, res) => {
  console.log('teste');

  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      fileSize: 15 * 1024 * 1024 // 15mb
    }
  });

  const audio = new Audio();

  const fileBuffer = [];

  busboy.on('file', (fieldname, file) => {
    file.on('data', data => {
      fileBuffer.push(data);
    });

    file.on('end', () => {
    });

  });

  busboy.on('finish', () => {
    const audioData = new AudioData();

    audioData.file = Buffer.concat(fileBuffer);

    audioData.save((err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        audio.file = audioData._id;

        audio.save((err2) => {
          if (err2) {
            res.status(400).send(err2);
          } else {
            res.writeHead(200, { Connection: 'close' });
            res.end();
          }
        });
      }
    });

  });

  busboy.on('field', (fieldname, val) => {
    audio[fieldname] = val;
  });

  req.pipe(busboy);
});

module.exports = Audio;
