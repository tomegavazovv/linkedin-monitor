const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getComments } = require('../utils/feed/getComments');
const getVideo = require('../utils/feed/getVideo');

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await getComments(req.params.urn);
  res.status(200).json({
    data: comments
  });
});

exports.likePost = catchAsync(async (req, res, next) => {
  const { urn } = req.params;
  const user = await User.findById(req.user.id);

  user.engagements.push({
    reaction: 'LIKE',
    urn
  });

  await user.save();

  res.status(200).json({
    data: urn
  });
});

exports.skipPost = catchAsync(async (req, res, next) => {
  const { urn } = req.params;
  const user = await User.findById(req.user.id);

  user.engagements.push({
    skip: true,
    urn
  });

  await user.save();

  res.status(200).json({
    data: urn
  });
});

exports.commentPost = catchAsync(async (req, res, next) => {
  const { urn } = req.params;
  const { comment } = req.body;
  const user = await User.findById(req.user.id);

  user.engagements.push({
    comment,
    urn
  });

  await user.save();

  res.status(200).json({
    data: urn
  });
});

exports.getVideo = catchAsync(async (req, res, next) => {
  const { urn } = req.params;
  const videoSrc = await getVideo(urn);

  res.status(200).json({
    data: videoSrc
  });
});
