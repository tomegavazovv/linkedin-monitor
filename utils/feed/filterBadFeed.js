const cheerio = require('cheerio');
const getFeed = require('./getFeed');

async function filterBadFeed(activityUrns) {
  const checks = await Promise.all(
    activityUrns.map(async activityUrn => {
      const url = `https://www.linkedin.com/feed/update/${activityUrn}`;
      try {
        const response = await getFeed(url);
        const $ = cheerio.load(response.data);
        const btns = $('#join-form-submit');
        const htmlPosts = $(
          '.core-section-container__content > ul > li > div > article'
        );
        return !(btns.length > 0 || htmlPosts.length === 0);
      } catch (error) {
        return false;
      }
    })
  );

  return activityUrns.filter((_, index) => checks[index]);
}

module.exports = filterBadFeed;
