import restful from 'node-restful';

const Script = restful.model('script', new restful.mongoose.Schema({
  user: {
    type: String,
    trim: true,
    required: true
  },
  data: {
    type: String,
    trim: true,
    required: true
  },
  key: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  }
}))
.methods(['get', 'put', 'post', 'delete']);

module.exports = Script;
