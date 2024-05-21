const mongoose = require('mongoose');
const postSchema = require('../../MonitoredUser/embedded/postSchema');
const engagementSchema = require('./engagementSchema');

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    monitoredUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'MonitoredUser'
      }
    ],
    lastUpdated: {
      type: Date
    },
    preFetched: {
      type: [postSchema]
    },
    failed: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'MonitoredUser'
      }
    ],
    loading: {
      type: Boolean,
      default: false
    },
    value: Number,
    skipped: [String],
    engagements: [engagementSchema]
  },
  {
    versionKey: false // This disables the versioning
  }
);

module.exports = listSchema;
