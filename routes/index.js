const Router = require('express')
const router = new Router()
const usersRouter = require('./usersRouter')
const childrenRouter = require('./childrenRouter')

router.use('/users', usersRouter)
router.use('/children', childrenRouter)

module.exports = router