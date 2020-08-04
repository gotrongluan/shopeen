var express = require('express');
const ShopController = require('../controllers/ShopController');

var router = express.Router();

router.post('/', ShopController.postShop);
router.post('/products', ShopController.postProducts);
router.get('/', ShopController.getAll);
router.get('/promotions', ShopController.getPromotions);

module.exports = router;
