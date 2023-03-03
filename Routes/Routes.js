const express = require('express')
const { getAlldata } = require('../Controllers/Controllers')
const Router = express()

Router.post('/userdata',getAlldata)


module.exports = Router

