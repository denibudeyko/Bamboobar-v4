const { createProduct } = require('../controller/product')
const {Router} = require('express')
const router = Router()

router.post('/create', createProduct)

module.exports = router;
