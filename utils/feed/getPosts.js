const agenda = require('../../config/agendaConfig');
const fetchUserPosts = require('./fetchUserPosts');

async function getPostsLive(monitoredUsers, userId, listId = '', counter = 1) {
  const results = await Promise.all(
    monitoredUsers
      .filter(mUser => mUser.activityUrns.length > 0)
      .map(fetchUserPosts)
  );
  const posts = results.filter(result => !result.failedUser).flat();
  const failedUsers = results
    .filter(result => result.failedUser)
    .map(result => result.failedUser);

  console.log('getPostsLive');
  if (failedUsers.length > 0) {
    agenda.now('fetch failed posts', {
      monitoredUsers: failedUsers,
      listId: listId,
      userId: userId,
      counter: counter
    });
  }

  return posts;
}

exports.getPostsLive = getPostsLive;
