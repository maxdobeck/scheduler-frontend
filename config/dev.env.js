'use strict'
require('dotenv').config()
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"dev"',
  DEV_API: '"http://localhost:3030/"',
  MY_TEST: '"My big test case"'
})
