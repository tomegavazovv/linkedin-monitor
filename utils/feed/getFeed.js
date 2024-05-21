const axios = require('axios');
const randomUseragent = require('random-useragent');
const getProxyAgent = require('../getProxyAgent');

const getFeed = async url => {
  const source = axios.CancelToken.source();
  setTimeout(() => {
    source.cancel(`Request cancelled due to timeout for ${url}`);
  }, 5000); // Set timeout for 5 seconds
  const agent = getProxyAgent();
  try {
    return await axios.get(url, {
      httpAgent: agent,
      httpsAgent: agent,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-GB,en;q=0.9',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-ch-ua':
          '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'User-Agent': randomUseragent.getRandom()
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      method: 'GET',
      cancelToken: source.token, // Cancel token to manage timeout
      timeout: 5000 // 5 seconds timeout
    });
  } catch (error) {
    console.error(`Failed to fetch feed for ${url}: ${error.message}`);
    return null; // Return null or handle as per your error handling strategy
  }
};

module.exports = getFeed;
