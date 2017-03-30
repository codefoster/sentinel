module.exports = {
  utf8: {
    encode: c => new Buffer(JSON.stringify(c), 'utf-8'),
    decode: c => new Buffer(c).toString('utf-8')
  }
}
