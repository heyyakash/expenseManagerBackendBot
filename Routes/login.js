const express = require('express')
const { handleLogin } = require('../Controllers/Controllers')
const router = express()

router.post('/login',handleLogin)

module.exports = router