/* eslint-disable prettier/prettier */
const cheerio = require('cheerio');

function safeGet(data, path) {
  try {
    return path.reduce((acc, val) => acc[val], data);
  } catch (error) {
    return '';
  }
}

const extractComments = html => {
  const $ = cheerio.load(html);
  const htmlComments = $('div.comment__body');

  const comments = [];
  for (let i = 0; i < htmlComments.length; i += 1) {
    const photoSrc = $('section.comment > div > a > img')[i].attribs[
      'data-delayed-url'
    ];
    const name = $('div.comment__body > div.comment__header > a')[
      i
    ].children[0].data.trim();
    const headline = safeGet(
      $('div.comment__body > div.comment__header > p.comment__author-headline'),
      [i, 'children', 0, 'data']
    ).trim();
    const date = $(
      'div.comment__body > div.comment__header > span.comment__duration-since'
    )[i].children[0].data.trim();
    const textElements = $(
      'div.comment__body > div.attributed-text-segment-list__container > p.attributed-text-segment-list__content'
    )[i].children;
    const reactionCount = safeGet(
      $('div.comment__actions > a.comment__reactions-count'),
      [i, 'children', 0, 'data']
    ).trim();
    const elements = textElements.map(el => {
      if (el.tagName && el.tagName === 'a') {
        return `${el.children[0].data.trim()} - link`;
      }
      return el.data.trim();
    });

    comments.push({ photoSrc, name, headline, date, reactionCount, elements });
  }

  return comments;
};

exports.extractComments = extractComments;
