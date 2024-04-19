const agenda = require('../config/agendaConfig');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const MonitoredUser = require('../models/monitoredUserModel');

exports.getAll = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const data = user.lists.map(list => ({ name: list.name, id: list._id }));
  res.status(200).json({
    status: 'success',
    data: {
      data
    }
  });
});

exports.addToList = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const listId = req.params.id;

  const monitoredUser = await MonitoredUser.findOrCreate(req.body);
  const user = await User.findById(userId);
  await user.addMonitoredUserToList(listId, monitoredUser._id);

  if (monitoredUser.needsUpdate) {
    agenda.now('update monitored user', { monitoredUserId: monitoredUser._id });
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: null
    }
  });
});

exports.addList = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const user = await User.findById(req.user.id);

  const data = await user.addList(name);

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.getPosts = catchAsync(async (req, res, next) => {
  const listId = req.params.id;
  const posts = await User.getPostsFromList(req.user.id, listId);

  res.status(200).json({
    status: 'success',
    data: posts
  });
});
