const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const fs = require('fs');
const staticeUrl = './assets';
const gzip = require('./middlewares/gzip');
const reqfile = require('./middlewares/reqfile');
const strongCache = require('./middlewares/strong-cache');
const etagCache = require('./middlewares/etag-cache');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.use(async (ctx, next) => {
  const url = ctx.url;
  if(url === '/favicon.ico') {
    return
  }
  await next();
})

app.use(async (ctx, next) => {
  let url = ctx.url;
  url = path.join(__dirname, staticeUrl, url);
  ctx.url = url;
  await next();
  // ctx.body = ctx;
})

// 压缩文件
app.use(gzip());
// 强缓存
app.use(strongCache());

// 协商缓存
app.use(etagCache());

// 发送文件
app.use(reqfile());


// 错误处理
app.on('error', (e, ctx) => {
  ctx.body = {
    retCode: 'error',
    retMsg: e.message
  };
})
app.listen(8890, () => {
  console.log('服务启动成功', 8890)
})