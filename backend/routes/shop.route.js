var express = require('express');
const ShopController = require('../controllers/ShopController');

var router = express.Router();

router.post('/', ShopController.postShop);
// router.get('/', ShopController.getAll);

module.exports = router;
