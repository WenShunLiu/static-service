const fs = require('fs');
const { promisify } = require("util");
const stat = promisify(fs.stat);
const zlib = require('zlib');
const mime = require("mime");

module.exports =  (ctx, next) => {
  return async (ctx, next) => {
    console.log(ctx.url);
    const {url} = ctx;
    try {
      const state = await stat(url);
      if(state.isDirectory()) {
        ctx.throw(400, 'illegal url');
      }
      ctx.set('Content-Type', mime.getType(url));
      const acceptEncoding = ctx.get('accept-encoding');
      let gzipfile;
      if (acceptEncoding) {
        if (acceptEncoding.match(/\bgzip\b/)) {
          ctx.set('Content-Encoding', 'gzip');
          gzipfile = fs.createReadStream(url).pipe(zlib.createGzip());
        } else if(acceptEncoding.match(/\bdeflate\b/)) {
          ctx.set("Content-Encoding", "deflate");
          gzipfile = fs.createReadStream(url).pipe(zlib.createDeflate());
        } else {
          gzipfile = fs.createReadStream(url);
        }
      } else {
          gzipfile = fs.createReadStream(url);
      }
      ctx.gzipfile = gzipfile;
      ctx.stat = state;
      await next();
    } catch(e) {
      ctx.app.emit('error', e, ctx);
    }
  }
}