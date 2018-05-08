module.exports = (ctx, next) => {
  return async (ctx, next) => {
    const {gzipfile} = ctx;
    ctx.body = gzipfile;
  }
}