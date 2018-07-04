'use strict'
require('dotenv').config()
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  // Set the NODE_ENV here to change the api.
  NODE_ENV: '"test"',
  DEV_API: JSON.stringify(process.env.DEV_API),
  TEST_API: '"https://shielded-stream-75107.herokuapp.com/"',
  MY_TEST: '"My big test case"'
})
