const getRecentPosts = require('./utils/getRecentPosts');

getRecentPosts(
  'https://www.linkedin.com/feed/update/urn:li:activity:7185676228962500610'
).then(data => console.log(data));
