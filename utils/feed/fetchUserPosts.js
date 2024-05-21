const { extractPosts } = require('./extractPosts');
const getFeed = require('./getFeed');

async function fetchUserPosts(mUser) {
  const randomIndex = Math.floor(Math.random() * mUser.activityUrns.length);
  const url = `https://linkedin.com/feed/update/${mUser.activityUrns[randomIndex]}`;
  if (!mUser.activityUrns || mUser.activityUrns.length === 0) {
    return [];
  }
  return getFeed(url)
    .then(htmlData => extractPosts(htmlData.data))
    .catch(() => {
      console.log(
        `Error fetching or processing posts for ${mUser.activityUrns[randomIndex]}:`
      );
      return { failedUser: mUser, posts: [] };
    });
}

module.exports = fetchUserPosts;
