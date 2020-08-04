var express = require('express');
const PromotionController = require('../controllers/PromotionController');

var router = express.Router();

router.post('/', PromotionController.postPromotions);
// router.get('/', ShopController.getAll);

module.exports = router;
