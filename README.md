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
  await weiboo.post('Hello Weiboo');
})();
```

## License

MIT License
