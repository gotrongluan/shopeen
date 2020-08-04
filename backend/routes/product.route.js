var express = require('express');
const ProductController = require('../controllers/ProductController');

var router = express.Router();

router.post('/promotion', ProductController.postPromotion);
// router.get('/', ShopController.getAll);

module.exports = router;
