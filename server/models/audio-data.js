import restful from 'node-restful';

const AudioData = restful.model('audiodata', new restful.mongoose.Schema({
  file: {
    type: Buffer,
    required: true
  }
}))
.methods(['get', 'put', 'delete']);

AudioData.route('stream.get', {
  detail: true,
  handler: (req, res) => {
    AudioData.findById(req.params.id, (err, audio) => {
      if (err) {
        return res.end(err);
      }

      res.set({
        'Content-Type': 'arraybuffer',
        'Content-Length': audio.file.length
      });

      return res.status(200).send(audio.file);
    });
  }
});

module.exports = AudioData;
