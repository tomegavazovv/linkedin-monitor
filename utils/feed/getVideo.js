const cheerio = require('cheerio');
const getFeed = require('./getFeed');

const getVideo = async urn => {
  const response = await getFeed(`https://linkedin.com/feed/update/${urn}`);
  const $ = cheerio.load(response.data);
  const video = JSON.parse($('video')[0].attribs['data-sources']).find(
    dataSource => dataSource.type === 'video/mp4'
  ).src;
  return video;
};

module.exports = getVideo;
