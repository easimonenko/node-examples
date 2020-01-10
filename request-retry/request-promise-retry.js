const retry = require('promise-retry')
const request = require('request-promise-native')

retry((ret, num) => {
    return request('http://registry.npmjs.org/@types/minimatch')
      .catch(err => {
        console.log(err.code + ': ' + err.message)
        if (err.code == 'ETIMEDOUT' || err.code == 'ECONNRESET') {
          return ret(err)
        }
        throw err
      })
  })
  .then(body => {
    console.log(JSON.parse(body))
  })
  .catch(err => {
    console.log(err.code + ': ' + err.message)
  })
