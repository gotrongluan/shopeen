var express = require('express');
const AccomController = require('../controllers/ShopController');

var router = express.Router();

router.post('/', AccomController.postAccom);
router.get('/', AccomController.getAllAccoms);

module.exports = router;
