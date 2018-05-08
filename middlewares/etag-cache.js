const fs = require('fs');
const crypto = require('crypto');

module.exports = (ctx, next) => {
  return async (ctx, next) => {
    try {
      const {url} = ctx;
      const curEtag = ctx.get('If-None-Match');
      const stream = fs.createReadStream(url);
      const hash = crypto.createHash('md5');
      stream.on('readable', () => {
        let data = stream.read();
        if (!data) {
          data = new Buffer('null')
        };
        hash.update(data);
        const newEtag = hash.digest('hex');
        if (curEtag === newEtag) {
          ctx.status = 304;
          return;
        } else {
          ctx.set('ETag', newEtag);
        }
      })
      await next();
    } catch (error) {
      ctx.app.emit('error', error, ctx);
    }
  }
}