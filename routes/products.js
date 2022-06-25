const express = require("express");

const product = require("./../controllers/products");

const router = express.Router();

router.get('/', product.getProducts);
router.get('/:pId', product.getSpecProduct);
router.post('/add', product.createProduct);
router.patch('/:pId', product.updateProduct);
router.delete('/:pId', product.deleteProduct);

module.exports = router;