const axios = require('axios');
const cheerio = require('cheerio');

const soupSelectors = {
  post_headline: "[data-test-id='main-feed-activity-card__entity-lockup']",
  repost_headline: "div[data-test-id='feed-reshare-content__entity-lockup']"
};

function extractPost($, htmlPost, repost = false) {
  const headlineSelector = repost
    ? soupSelectors.repost_headline
    : soupSelectors.post_headline;

  const urn = htmlPost.attribs['data-activity-urn'];
  const profileImage = $(`${headlineSelector} > a > img`, htmlPost)[0].attribs[
    'data-delayed-url'
  ];
  const name = $(
    `${headlineSelector} > div > div > a`,
    htmlPost
  )[0].children[0].data.trim();
  const headline = $(
    `${headlineSelector} > div > p`,
    htmlPost
  )[0].children[2].data.trim();
  const date = $(
    `${headlineSelector} > div > span > time`,
    htmlPost
  )[0].children[0].data.trim();
  const text = $(
    'div.attributed-text-segment-list__container > p',
    htmlPost
  ).text();

  const postImageElement = $(
    `ul[data-test-id='feed-images-content'] > li > img`,
    htmlPost
  );
  const postImage = postImageElement.attr('data-delayed-url') || null;

  const likeCountElement = $(
    `div.main-feed-activity-card__social-actions > a > span`,
    htmlPost
  );
  const likeCount = likeCountElement.text().trim() || 0;

  const commentCountElement = $(
    `div.main-feed-activity-card__social-actions > a[data-tracking-control-name='public_post_main-feed-card_social-actions-comments']`,
    htmlPost
  );
  const commentCount = commentCountElement.attr('data-num-comments') || 0;

  return {
    urn,
    profileImage,
    name,
    headline,
    date,
    text,
    postImage,
    likeCount,
    commentCount
  };
}

function getPostsFromResponse(html) {
  const $ = cheerio.load(html);
  const htmlPosts = $(
    '.core-section-container__content > ul > li > div > article'
  );
  const posts = [];

  htmlPosts.each((_, htmlPost) => {
    const post = extractPost($, htmlPost);
    const htmlRepost = $(htmlPost).find('article');
    if (htmlRepost.length > 0) {
      const repost = extractPost($, htmlRepost[0], true);
      post.repost = repost;
    }
    posts.push(post);
  });

  return posts;
}

async function getPostsFromActivities(activityUrns) {
  let index = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const activityUrn of activityUrns) {
    const url = `https://www.linkedin.com/feed/update/${activityUrn}`;
    // eslint-disable-next-line no-await-in-loop
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const btn = $('#join-form-submit');
    if (btn.length === 1) {
      index += 1;
    } else {
      break;
    }
  }
  const url = `https://www.linkedin.com/feed/update/${activityUrns[index]}`;
  const response = await axios.get(url);
  return {
    posts: getPostsFromResponse(response.data),
    activityUrns: activityUrns.slice(index)
  };
}

module.exports = getPostsFromActivities;
