const { User } = require('../models');
const fetchUserPosts = require('../utils/feed/fetchUserPosts');

module.exports = agenda => {
  agenda.define('fetch failed posts', async job => {
    const { monitoredUsers, listId, userId, counter } = job.attrs.data;
    if (counter > 3 || monitoredUsers.length === 0) return;

    const results = await Promise.all(monitoredUsers.map(fetchUserPosts));
    const posts = results.filter(result => !result.failedUser).flat();
    const failedUsers = results
      .filter(result => result.failedUser)
      .map(result => result.failedUser);

    const user = await User.findById(userId);
    const list = user.lists.id(listId);

    try {
      list.preFetched.push(...posts);
      list.failed = [];
      await user.save();
    } catch (err) {
      console.log(err);
    }

    console.log('calling');
    console.log(monitoredUsers.length);
    if (failedUsers.length > 0) {
      agenda.now('fetch failed posts', {
        monitoredUsers: failedUsers,
        listId: listId,
        userId: userId,
        counter: counter + 1
      });
    }
  });
};
