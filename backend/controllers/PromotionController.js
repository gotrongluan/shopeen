const ShopModel = require('../models/ShopModel');
const ProductModel = require('../models/ProductModel');
const PromotionModel = require('../models/PromotionModel');
const apiResponse = require('../helpers/apiResponse');
const mongoose = require('mongoose');
const authenticate = require('../middlewares/jwt');
const UserModel = require('../models/UserModel');
const e = require('express');
const ObjectId = mongoose.Types.ObjectId;

exports.postPromotions = [
  authenticate,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return apiResponse.unauthorizedResponse(res, 'UNAUTHORIZED');
      }
      const { promotions } = req.body;
      let createPromotionsPromises = [];
      promotions.forEach((element) => {
        const promotion = new PromotionModel({
          name: element.name,
          description: element.description,
        });
        const response = promotion.save();
        createPromotionsPromises.push(response);
      });

      Promise.all(createPromotionsPromises)
        .then((result) => {
          console.log(`CREATE PROMOTIONS SUCCESS`);
        })
        .catch((err) => console.log(err));
      return apiResponse.successResponseWithData(res, 'SUCCESS');
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        const pattern = Object.keys(err.keyPattern)[0];
        return apiResponse.duplicateEntry(res, `${pattern} must be unique`);
      } else {
        return apiResponse.ErrorResponse(res, 'BAD_REQUEST');
      }
    }
  },
];
