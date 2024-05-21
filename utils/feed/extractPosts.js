/* eslint-disable prettier/prettier */
const cheerio = require('cheerio');
const { convertDateToHours } = require('./convertDateToHours');

const SOUP_SELECTORS = {
  post_headline: "[data-test-id='main-feed-activity-card__entity-lockup']",
  repost_headline: "div[data-test-id='feed-reshare-content__entity-lockup']"
};

function extractWithSelector($, selector, context, attr) {
  const element = $(selector, context);
  return attr ? element.attr(attr) : element.text().trim();
}

function safeGet(data, path) {
  try {
    return path.reduce((acc, val) => acc[val], data);
  } catch (error) {
    return '';
  }
}

function extractPost($, htmlPost, repost = false) {
  const headlineSelector = repost ? SOUP_SELECTORS.repost_headline : SOUP_SELECTORS.post_headline;
  const base = $(headlineSelector, htmlPost);

  const urn = htmlPost.attribs['data-activity-urn'];
  const profileImage = extractWithSelector($, '> a > img', base, 'data-delayed-url');
  const name = safeGet($( '> div > div > a', base)[0].children, [0, 'data']).trim();
  const headline = safeGet($('> div > p', base), [0, 'children', 2, 'data']).trim();
  const date = safeGet($('> div > span > time', base)[0].children, [0, 'data']).trim();
  const text = $('div.attributed-text-segment-list__container > p', htmlPost).text().trim();

  const postImagesList = $('ul[data-test-id="feed-images-content"] > li > img', htmlPost);
  const postImages = postImagesList.length > 0 ? postImagesList.map((index, el) => $(el).attr('data-delayed-url')).get() : [];
  const videoExists = $('div[data-test-id="feed-native-video-content"]', htmlPost).length > 0;
  let videoPoster = '';
  if(videoExists) videoPoster = $('div[data-test-id="feed-native-video-content"]', htmlPost)[0].children.filter(child => child.tagName === 'video')[0].attribs['data-poster-url']
  const carouselExists = $('iframe', htmlPost).length > 0 &&  !$('iframe', htmlPost)[0].attribs['data-delayed-url'].includes('youtube'); 
  let carousel = ''
  if(carouselExists) carousel = JSON.parse($('iframe', htmlPost)[0].attribs['data-native-document-config']).doc.manifestUrl; 
  const likeCount = extractWithSelector($, 'div.main-feed-activity-card__social-actions > a > span', htmlPost);
  const commentCount = $(`div.main-feed-activity-card__social-actions > a[data-tracking-control-name="public_post_main-feed-card_social-actions-comments"]`, htmlPost).attr('data-num-comments') || 0;

  return { urn, profileImage, name, headline, date, text, postImages, likeCount, commentCount, videoPoster, carousel };
}

const checkDateCondition = (date) => {
  const postHour = convertDateToHours(date);
  const hourFilter = 72;
  // if(filter && filter.lt) hourFilter = filter.lt
  return postHour <= Number(hourFilter)
}

const handleReposts = ($, htmlPost, post) => {
  try {
    const htmlRepost = $(htmlPost).find('article');
    if (htmlRepost.length > 0) {
      const repost = extractPost($, htmlRepost[0], true);
      post.repost = repost;
    }
  } catch (err) { 
    console.error('Error handling repost:', err);
  }
};

const extractSinglePost = ($, htmlPost) => {
  try {
    return extractPost($, htmlPost);
  } catch (err) {
    console.error('Error extracting post:', err);
    return null;
  }
};

const processPosts = (htmlPosts, $) => {
  let breakFlag = false;
  const posts = htmlPosts.map((_, htmlPost) => {
    if(breakFlag) return null
    const post = extractSinglePost($, htmlPost);
    if (!post) return null; 

    const isFresh = checkDateCondition(post.date);
    if (!isFresh) {
      breakFlag = true;
      return null
    }

    handleReposts($, htmlPost, post);
    return post;
  }).get()

  return posts;
};

const extractPosts =  (html) => {
  const $ = cheerio.load(html);
  const htmlPosts = $('.core-section-container__content > ul > li > div > article');
  let processedPosts = []
  try{
    processedPosts = processPosts(htmlPosts, $);
  }
  catch(err){
    console.log(err)
  }
  return processedPosts
};

exports.extractPosts = extractPosts