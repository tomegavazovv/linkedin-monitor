const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/User/model');
const MonitoredUser = require('../models/MonitoredUser/model');
const { convertDateToHours } = require('../utils/feed/convertDateToHours');

exports.getAll = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const lists = user.lists.map(list => ({
    name: list.name,
    id: list._id,
    numberMonitored: list.monitoredUsers.length,
    loading: list.loading,
    value: list.value
  }));

  res.status(200).json({
    data: {
      lists: lists
    }
  });
});

exports.addToList = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const listId = req.params.id;
  const { publicId } = req.body;

  const monitoredUser = await MonitoredUser.findOrCreate(req.body);
  const user = await User.findById(userId);
  try {
    await user.addMonitoredUserToList(listId, monitoredUser._id, publicId);
    return res.status(201).json({
      data: {
        id: monitoredUser._id
      }
    });
  } catch (err) {
    if (err.message.includes('Limit')) {
      return res.status(400).json({
        status: 'Users Limit',
        hours: err.message.split('[')[1].split(']')[0]
      });
    }
  }
  // if (monitoredUser.needsUpdate) {
  //   agenda.now('update monitored user', { monitoredUserId: monitoredUser._id });
  // }
});

exports.getEngagements = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const listId = req.params.id;

  const user = await User.findById(userId);
  const engagements = await user.getEngagements(listId);

  res.status(200).json({
    data: engagements
  });
});

exports.addList = catchAsync(async (req, res, next) => {
  const { name, loading, value } = req.body;
  const user = await User.findById(req.user.id);
  if (user.lists.some(list => list.name === name))
    return next(new AppError(`List with name ${name} already exists.`, 400));

  const list = await user.addList(name, loading, value);

  res.status(200).json({
    data: {
      id: list._id,
      name: list.name
    }
  });
});

exports.awareListsUploaded = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  await user.awareListsUploaded();

  res.status(200).json({
    data: {}
  });
});

exports.updateListName = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  const user = await User.findById(req.user.id);
  const updatedList = await user.updateListName(id, name);

  res.status(200).json({
    data: updatedList
  });
});

exports.deleteList = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(req.user.id);
  await user.deleteList(id);

  res.status(200).json({
    data: {
      message: 'success'
    }
  });
});

exports.getListUrl = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { date } = req.query;
  const user = await User.findById(req.user.id);
  const url = await user.getListUrl(id, date);

  res.status(200).send(url);
});

exports.deleteFromList = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { id, userId } = req.params;
  await user.deleteFromList(id, userId);

  res.status(200).json({
    data: 'success'
  });
});

exports.getPosts = catchAsync(async (req, res, next) => {
  const listId = req.params.id;
  const posts = await User.getPostsFromList(req.user.id, listId);

  res.status(200).json({
    data: posts
  });
});

exports.skipPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { urn } = req.body;
  const user = await User.findById(req.user.id);
  await user.skipPost(id, urn);

  res.status(200).json({ status: 'success' });
});

exports.commentToPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { urn } = req.body;

  const user = await User.findById(req.user.id);
  await user.skipPost(id, urn);

  res.status(200).json({ status: 'success' });
});

exports.commentToProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { urn, postUrn } = req.body;

  const user = await User.findById(req.user.id);
  await user.commentToProfile(id, urn, postUrn);

  res.status(200).json({ status: 'success' });
});

exports.likeToProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { urn, postUrn } = req.body;

  const user = await User.findById(req.user.id);
  await user.likeToProfile(id, urn, postUrn);

  res.status(200).json({ status: 'success' });
});

exports.getSkippedPosts = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(req.user.id);
  const skippedPosts = user.getSkippedPosts(id);

  res.status(200).json({
    data: skippedPosts
  });
});

exports.getPostsLive = catchAsync(async (req, res, next) => {
  const listId = req.params.id;
  const user = await User.findById(req.user.id);
  const engagementsMap = new Map();
  user.engagements.forEach(engagement =>
    engagementsMap.set(engagement.urn, true)
  );
  const posts = await user.getPostsLiveFromList(listId);
  let hours = 24;
  if (req.query.hours) hours = req.query.hours.lt;

  const filteredPosts = posts
    .filter(
      post =>
        hours - convertDateToHours(post.date) >= 0 &&
        !engagementsMap.has(post.urn)
    )
    .sort(
      (p1, p2) => convertDateToHours(p1.date) - convertDateToHours(p2.date)
    );
  res.status(200).json({
    data: filteredPosts
  });
});

exports.getMonitoredUsers = catchAsync(async (req, res, next) => {
  const listId = req.params.id;
  const userId = req.user.id;
  const list = await User.getMonitoredUsersFromList(userId, listId);

  res.status(200).json({
    data: list
  });
});
