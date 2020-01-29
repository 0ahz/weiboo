# weiboo

weibo tools

## Install

```shell
npm i weiboo
```

## Example

```js
const weiboo = require('weiboo')({
  domain: '', // required
  username: '', // required
  password: '', // required
  cachePath: '', // required
});

(async () => {
  await weiboo.post({ text: 'Hello Weiboo' });
})();
```

## License

MIT License
