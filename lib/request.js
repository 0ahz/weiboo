const superagent = require('superagent');

const defaultHeaders = {
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
  Connection: 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest',
  Expires: '-1',
  'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=-1,private',
};

module.exports = function(config = {}) {
  return {
    post(url, data, options = {}) {
      const headers = {
        ...defaultHeaders,
        ...config.headers,
        ...options.headers,
      };
      const httpClient = superagent.post(url).withCredentials();
      httpClient.set(headers);
      if (data) {
        httpClient.send(data);
      }
      return httpClient;
    },
  };
};
