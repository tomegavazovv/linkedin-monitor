const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema({
  monitoredUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'MonitoredUser'
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  likePostUrns: [String],
  commentPostUrns: [String]
});

module.exports = engagementSchema;
