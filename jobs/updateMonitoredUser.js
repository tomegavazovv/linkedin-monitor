const MonitoredUser = require('../models/monitoredUserModel');
const getRecentPostsFromActivityUrns = require('../utils/getRecentPosts');

module.exports = agenda => {
  agenda.define('update monitored user', async job => {
    const { monitoredUserId } = job.attrs.data;
    const monitoredUser = await MonitoredUser.findById(monitoredUserId);
    const { posts, activityUrns } = await getRecentPostsFromActivityUrns(
      monitoredUser.activityUrns
    );
    monitoredUser.posts = posts;
    monitoredUser.activityUrns = activityUrns;
    monitoredUser.needsUpdate = false;
    await monitoredUser.save();
  });
};
