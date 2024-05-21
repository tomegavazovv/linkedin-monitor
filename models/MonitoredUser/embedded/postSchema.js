const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  urn: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  postImages: [String],
  date: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  headline: {
    type: String
  },
  videoPoster: String,
  carousel: String,
  profileImage: {
    type: String,
    required: true
  },
  likeCount: {
    type: String
  },
  commentCount: {
    type: String
  },
  repost: {},
  video: String
});

module.exports = postSchema;
