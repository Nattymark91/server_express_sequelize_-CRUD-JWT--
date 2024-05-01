const Router = require('express')
const router = new Router()
const childrenController = require('../controllers/childrenController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, childrenController.create)
router.get('/', childrenController.getAll)
router.patch('/:id', authMiddleware, childrenController.update)
router.delete('/:id', authMiddleware, childrenController.delete)

module.exports = router