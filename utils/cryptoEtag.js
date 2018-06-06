const fs = require('fs');
const crypto = require('crypto');

module.exports = (fileUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const stream = fs.createReadStream(fileUrl);
      const hash = crypto.createHash('md5');
      stream.on('readable', () => {
        let data = stream.read();
        if(data) {
          hash.update(data);
        } else {
          const newEtag = hash.digest('hex');
          resolve(newEtag);
        }
      })
    } catch (error) {
      reject(error);
    }
    
  })
}