const mongoose = require('mongoose');

const engageSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Comment cannot be empty.']
  },
  reaction: {
    type: String,
    enum: ['LIKE', 'LOVE', 'CELEBRATE', 'SUPPORT', 'INSIGHTFUL', 'FUNNY']
  },
  skip: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const postSchema = new mongoose.Schema({
  urn: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  postImage: String,
  date: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  headline: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  likeCount: {
    type: Number,
    required: true
  },
  commentCount: {
    type: Number,
    required: true
  },
  repost: {},
  engagement: [engageSchema]
});

const monitoredUserSchema = new mongoose.Schema({
  urn: {
    type: String,
    required: true,
    unique: true
  },
  activityUrns: {
    type: [String],
    required: true
  },
  posts: [postSchema],
  needsUpdate: {
    type: Boolean,
    default: false
  }
});

monitoredUserSchema.statics.findOrCreate = async function(body) {
  let monitoredUser = await this.findOne({ urn: body.urn });
  if (!monitoredUser) {
    // const { posts, activityUrns } = await getRecentPostsFromActivityUrns(
    //   body.activityUrns
    // );
    // body.posts = posts;
    // body.activityUrns = activityUrns;
    body.needsUpdate = true;
    monitoredUser = await this.create(body);
  }
  return monitoredUser;
};

const MonitoredUser = mongoose.model('MonitoredUser', monitoredUserSchema);

module.exports = MonitoredUser;
