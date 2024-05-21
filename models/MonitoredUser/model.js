const mongoose = require('mongoose');
// const postSchema = require('./embedded/postSchema');
const { findOneOrCreate } = require('./methods');

const monitoredUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  headline: {
    type: String
  },
  profileImage: {
    type: String
  },
  urn: {
    type: String,
    required: true
  },
  activityUrns: {
    type: [String]
  },
  company: String,
  publicId: String,
  needsUpdate: {
    type: Boolean,
    default: false
  }
});

monitoredUserSchema.statics.findOrCreate = findOneOrCreate;

const MonitoredUser = mongoose.model('MonitoredUser', monitoredUserSchema);

module.exports = MonitoredUser;
