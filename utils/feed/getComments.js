const axios = require('axios');
const { extractComments } = require('./extractComments');
const getProxyAgent = require('../getProxyAgent');

exports.getComments = async urn => {
  const url = `https://linkedin.com/feed/update/${urn}`;
  const res = await axios(url, {
    httpAgent: getProxyAgent(),
    httpsAgent: getProxyAgent(),
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-GB,en;q=0.9',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua':
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    method: 'GET'
  });

  const comments = extractComments(res.data);
  return comments;
};
