const mongoose = require('mongoose');

const { getPostsLive } = require('../../utils/feed/getPosts');

exports.awareListsUploaded = async function() {
  this.lists.forEach(list => {
    list.loading = false;
  });
  await this.save();
};

exports.getPostsFromList = function(userId, listId) {
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

exports.getPostsLiveFromList = async function(listId) {
  const { lastUpdated } = this.lists.id(listId);
  const diff = (Date.now() - lastUpdated) / 1000 / 60;
  if (diff > 1 || lastUpdated === undefined) {
    await this.populate({
      path: 'lists.monitoredUsers',
      match: { _id: { $in: this.lists.id(listId).monitoredUsers } }
    });

    const list = this.lists.id(listId);
    const { monitoredUsers } = list;
    const posts = await getPostsLive(monitoredUsers, this._id, listId);

    list.preFetched = posts;
    list.lastUpdated = Date.now();
    this.save();

    return posts;
  }
  return this.lists.id(listId).preFetched;
};
