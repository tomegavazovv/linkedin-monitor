const mongoose = require('mongoose');
const validator = require('validator');
const listSchema = require('./embedded/listSchema');

const {
  getPostsFromList,
  getPostsLiveFromList,
  awareListsUploaded
} = require('./methods');
const {
  addNewList,
  addMonitoredUserToList,
  deleteList,
  deleteFromList,
  updateListName,
  getListUrl,
  skipPost,
  getSkipped,
  commentToProfile,
  likeToProfile,
  getEngagements,
  getMonitoredUsersFromList,
  addDuplicateLists
} = require('./methods/lists');
const {
  hashPasswordIfInitialSave,
  updatePasswordSavedAt,
  filterNotActive,
  correctPassword,
  changedPasswordAfter,
  createPasswordResetToken
} = require('./methods/authentication');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  photo: String,
  lists: [listSchema],
  lastAdded: {
    type: Date
  },
  totalAdded: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  monitoredUsersPublicIds: [String],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.methods.addList = addNewList;
userSchema.methods.addMonitoredUserToList = addMonitoredUserToList;
userSchema.methods.getPostsLiveFromList = getPostsLiveFromList;
userSchema.methods.deleteList = deleteList;
userSchema.methods.deleteFromList = deleteFromList;
userSchema.methods.updateListName = updateListName;
userSchema.methods.awareListsUploaded = awareListsUploaded;
userSchema.methods.getListUrl = getListUrl;
userSchema.methods.skipPost = skipPost;
userSchema.methods.getSkippedPosts = getSkipped;
userSchema.methods.commentToProfile = commentToProfile;
userSchema.methods.likeToProfile = likeToProfile;
userSchema.methods.getEngagements = getEngagements;
userSchema.methods.addDuplicateLists = addDuplicateLists;

userSchema.statics.getMonitoredUsersFromList = getMonitoredUsersFromList;
userSchema.statics.getPostsFromList = getPostsFromList;

userSchema.pre('save', hashPasswordIfInitialSave);
userSchema.pre('save', updatePasswordSavedAt);
userSchema.pre(/^find/, filterNotActive);

userSchema.methods.correctPassword = correctPassword;
userSchema.methods.changedPasswordAfter = changedPasswordAfter;
userSchema.methods.createPasswordResetToken = createPasswordResetToken;

const User = mongoose.model('User', userSchema);

module.exports = User;
