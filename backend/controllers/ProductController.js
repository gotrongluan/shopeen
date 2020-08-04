const ShopModel = require('../models/ShopModel');
const ProductModel = require('../models/ProductModel');
const PromotionModel = require('../models/PromotionModel');
const apiResponse = require('../helpers/apiResponse');
const mongoose = require('mongoose');
const authenticate = require('../middlewares/jwt');
const UserModel = require('../models/UserModel');
const e = require('express');
const ObjectId = mongoose.Types.ObjectId;

exports.postPromotion = [
  authenticate,
  async (req, res) => {
    try {
      const { productid, promotionName } = req.body;
      const product = await ProductModel.findById(productid);
      const shop = await ShopModel.findById(product.shop);
      // console.log(
      //   typeof req.user._id,
      //   typeof shop.owner,
      //   shop.owner.toString() === req.user._id,
      // );
      if (shop.owner.toString() !== req.user._id) {
        return apiResponse.ErrorResponse(res, 'BAD_REQUEST');
      }

      const promotion = await PromotionModel.findOne({ name: promotionName });
      product.promotion = promotion._id;
      await product.save();
      return apiResponse.successResponseWithData(res, 'SUCCESS');
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        const pattern = Object.keys(err.keyPattern)[0];
        return apiResponse.duplicateEntry(res, `${pattern} must be unique`);
      } else {
        console.log(err);
        return apiResponse.ErrorResponse(res, 'BAD_REQUEST');
      }
    }
  },
];
