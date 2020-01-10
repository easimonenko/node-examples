const retry = require('retry')
const request = require('request-promise-native')

const operation = retry.operation()

operation.attempt(() => {
  return request('http://registry.npmjs.org/@types/minimatch/latest')
    .then(body => {
      console.log(JSON.parse(body))
    })
    .catch(err => {
      console.log(err.message)
      operation.retry(err)
    })
})
