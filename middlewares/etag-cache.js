const cryptoETag = require('../utils/cryptoEtag');

module.exports = (ctx, next) => {
  return async (ctx, next) => {
    try {
      const {url} = ctx;
      const curEtag = ctx.get('If-None-Match');
      const newEtag = await cryptoETag(url);

      if (curEtag === newEtag) {
        ctx.status = 304;
        return;
      } else {
        ctx.set('ETag', newEtag);
      }
      
      await next();
    } catch (error) {
      ctx.app.emit('error', error, ctx);
    }
  }
}