/* eslint-disable no-await-in-loop */
const { default: axios } = require('axios');
const getProxyAgent = require('../getProxyAgent');

const _getImagesUrl = async url => {
  const res = await axios.get(url, {
    httpAgent: getProxyAgent(),
    httpsAgent: getProxyAgent()
  });
  const imageUrl = res.data.perResolutions.find(
    resolution => resolution.width === 650
  ).imageManifestUrl;

  return imageUrl;
};

const getCarouselImages = async url => {
  let counter = 0;
  let images = [];
  while (counter < 3) {
    try {
      const imagesUrl = await _getImagesUrl(url);
      const imagesResponse = await axios.get(imagesUrl);
      images = imagesResponse.data.pages;
      break;
    } catch (err) {
      counter += 1;
    }
  }

  return images;
};

module.exports = getCarouselImages;
