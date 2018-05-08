const MAX_AGE_SECONDS = 20;


module.exports = (ctx, next) => {
  return async (ctx, next) => {
    try {
      ctx.set('Cache-Control', `max-age=${MAX_AGE_SECONDS}`);
      await next();
    } catch (error) {
      ctx.app.emit('error', error, ctx);
    }
  }
}