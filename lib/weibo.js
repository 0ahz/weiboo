const fs = require('fs');
const qs = require('querystring');

const request = require('./request')();

async function cacheCookie(config, cookie) {
  const { cachePath, domain } = config;
  return fs.writeFileSync(`${cachePath}/cookie_${domain}.txt`, cookie);
}

async function getCookie(config) {
  const { cachePath, domain } = config;
  try {
    const str = fs.readFileSync(`${cachePath}/cookie_${domain}.txt`, 'utf8');
    return (str || '').trim();
  } catch (error) {}
  return '';
}

async function login(config) {
  const { username, password } = config;
  const url = 'https://passport.weibo.cn/sso/login';
  const data = qs.stringify({
    username: username,
    password: password,
    savestate: 1,
    r: 'https://m.weibo.cn/',
    ec: 0,
    pagerefer:
      'https://m.weibo.cn/login?backURL=https%253A%252F%252Fm.weibo.cn%252F',
    entry: 'mweibo',
    wentry: '',
    loginfrom: '',
    client_id: '',
    code: '',
    qq: '',
    mainpageflag: 1,
    hff: '',
  });
  const headers = {
    Host: 'passport.weibo.cn',
    Origin: 'https://passport.weibo.cn',
    Referer: 'https://passport.weibo.cn/signin/login',
  };
  const res = await request.post(url, data, { headers });
  await cacheCookie(config, res.header['set-cookie']);
  const result = JSON.parse(res.text);
  if (result.retcode !== 20000000) {
    throw new Error(result.msg);
  }
  return { success: true, message: result.msg };
}

async function post(config, text, pic_ids) {
  let cookie = await getCookie(config);
  if (!cookie) {
    await login(config);
    cookie = await getCookie(config);
  }
  const query = qs.stringify({
    ajwvr: 6,
    __rnd: new Date() - 0,
  });
  const data = qs.stringify({
    location: 'v6_content_home',
    text: text,
    appkey: '',
    style_type: '1',
    pic_id: pic_ids,
    tid: '',
    pdetail: '',
    mid: '',
    isReEdit: 'false',
    rank: '0',
    rankid: '',
    module: 'stissue',
    pub_source: 'main_',
    pub_type: 'dialog',
    isPri: '0',
    _t: '0',
  });
  const headers = {
    Cookie: cookie,
    Host: 'weibo.com',
    Origin: 'https://weibo.com',
    Referer: 'https://weibo.com',
  };
  const url = `https://weibo.com/aj/mblog/add?${query}`;
  const res = await request.post(url, data, { headers });
  const result = JSON.parse(res.text);
  return { success: result.code === '100000', message: result.msg };
}

async function forward(config, params) {
  let cookie = await getCookie(config);
  if (!cookie) {
    await login(config);
    cookie = await getCookie(config);
  }
  const query = qs.stringify({
    ajwvr: 6,
    domain: config.domain,
    __rnd: new Date() - 0,
  });
  const data = qs.stringify({
    pic_src: '',
    pic_id: '',
    appkey: '',
    mid: '',
    style_type: 1,
    mark: '',
    reason: '',
    from_plugin: 0,
    location: 'v6_content_home',
    pdetail: '',
    module: '',
    page_module_id: '',
    refer_sort: '',
    rank: 0,
    rankid: '',
    group_source: 'group_all',
    rid: '',
    isReEdit: false,
    _t: 0,
    ...params,
  });
  const headers = {
    Cookie: cookie,
    Host: 'weibo.com',
    Origin: 'https://weibo.com',
    Referer: 'https://weibo.com',
  };
  const url = `https://weibo.com/aj/mblog/forward?${query}`;
  const res = await request.post(url, data, { headers });
  const result = JSON.parse(res.text);
  return { success: result.code === '100000', message: result.msg };
}

module.exports = function(config = {}) {
  return {
    post(text, pic_ids = '') {
      return post(config, text, pic_ids);
    },
    forward(params) {
      return forward(config, params);
    },
  };
};
