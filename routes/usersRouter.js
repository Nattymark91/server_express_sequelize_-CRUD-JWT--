const Router = require('express')
const router = new Router()
const usersController = require('../controllers/usersController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', usersController.registration)
router.post('/login', usersController.login)
router.get('/', usersController.getAll)
router.get('/:id', usersController.getOne)
router.patch('/:id', authMiddleware, usersController.update)

module.exports = router