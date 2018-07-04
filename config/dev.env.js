'use strict'
require('dotenv').config()
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
<<<<<<< HEAD
  // Set the NODE_ENV here to change the api.
  NODE_ENV: '"test"',
  DEV_API: JSON.stringify(process.env.DEV_API),
  TEST_API: JSON.stringify(process.env.TEST_API)
=======
  NODE_ENV: '"dev"',
  DEV_API: '"http://localhost:3030/"',
  MY_TEST: '"My big test case"'
>>>>>>> master
})
