const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  monitoredUsers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'MonitoredUser'
    }
  ]
});

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
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  photo: String,
  lists: [listSchema]
});

userSchema.methods.addMonitoredUserToList = async function(
  listId,
  monitoredUserId
) {
  const list = this.lists.id(listId);

  if (!list.monitoredUsers.includes(monitoredUserId)) {
    list.monitoredUsers.push(monitoredUserId);
    const doc = await this.save();
    return doc;
  }
};

userSchema.methods.addList = async function(listName) {
  if (this.lists.some(list => list.name === listName))
    throw new AppError(`List with name ${listName} already exists.`, 400);
  this.lists.push({ name: listName, monitoredUsers: [] });
  const user = await this.save();
  return user.lists.find(list => list.name === listName)._id;
};

userSchema.statics.getPostsFromList = function(userId, listId) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    {
      $project: {
        name: 1,
        lists: {
          $filter: {
            input: '$lists',
            as: 'list',
            cond: {
              $eq: ['$$list._id', mongoose.Types.ObjectId(listId)]
            }
          }
        }
      }
    },
    { $unwind: '$lists' },
    {
      $lookup: {
        from: 'monitoredusers',
        localField: 'lists.monitoredUsers',
        foreignField: '_id',
        as: 'lists.monitoredUsers'
      }
    },
    {
      $group: {
        _id: '$_id',
        monitoredUsers: { $push: '$lists' }
      }
    }
  ]);
};

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
