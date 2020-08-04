const ShopModel = require('../models/ShopModel');
const ProductModel = require('../models/ProductModel');
const PromotionModel = require('../models/PromotionModel');
const apiResponse = require('../helpers/apiResponse');
const mongoose = require('mongoose');
const authenticate = require('../middlewares/jwt');
const UserModel = require('../models/UserModel');
const e = require('express');
const ObjectId = mongoose.Types.ObjectId;

exports.getAll = [
  async (req, res) => {
    try {
      const { long, lat, radius } = req.query;
      if (parseFloat(radius) == -1) {
        const shops = await ShopModel.find({});
        const shopInfos = shops.map((value) => {
          let info = {
            name: value.name,
            address: value.address,
            location: {
              long: value.location.coordinates[0],
              lat: value.location.coordinates[1],
            },
            category: value.category,
            description: value.description,
          };
          return info;
        });
        console.log(shopInfos);
        return apiResponse.successResponseWithData(res, 'SUCCESS', shopInfos);
      } else {
        const shops = await ShopModel.find({
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(long), parseFloat(lat)],
              },
              $maxDistance: parseFloat(radius),
            },
          },
        });
        const shopInfos = shops.map((value) => {
          let info = {
            _id: value._id,
            name: value.name,
            address: value.address,
            location: {
              long: value.location.coordinates[0],
              lat: value.location.coordinates[1],
            },
            category: value.category,
            description: value.description,
          };
          return info;
        });
        console.log(shopInfos);
        return apiResponse.successResponseWithData(res, 'SUCCESS', shopInfos);
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, 'Server problem');
    }
  },
];

exports.getPromotions = [
  authenticate,
  async (req, res) => {
    try {
      const { shopid } = req.query;
      const promotedProducts = await ProductModel.find({
        shop: shopid,
        promotion: { $ne: null },
      });
      console.log(promotedProducts);
      const promotedProductInfos = promotedProducts.map(async (value) => {
        const promotion = await PromotionModel.findById(value.promotion);
        let info = {
          _id: value._id,
          name: value.name,
          description: value.description,
          promotion: promotion,
        };
        return info;
      });
      console.log(promotedProductInfos);
      Promise.all(promotedProductInfos).then((result) => {
        return apiResponse.successResponseWithData(res, 'SUCCESS', result);
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, 'Server Problem');
    }
  },
];

exports.postShop = [
  authenticate,
  async (req, res) => {
    try {
      const shop = new ShopModel({
        name: req.body.name,
        address: req.body.address,
        description: req.body.description,
        owner: req.user._id,
        category: req.body.category,
        location: {
          type: 'Point',
          coordinates: [req.body.coordinates.long, req.body.coordinates.lat],
        },
      });
      await shop.save();
      // const owner = await UserModel.findById(req.user._id);
      // console.log(owner.ownedShop);
      // owner.ownedShop.push(shop);
      // await owner.save();
      return apiResponse.successResponseWithData(res, 'Created', shop._id);
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

exports.postProducts = [
  authenticate,
  async (req, res) => {
    try {
      const { products, shopid } = req.body;
      let createProductPromises = [];
      products.forEach((element) => {
        const product = new ProductModel({
          name: element.name,
          description: element.description,
          shop: shopid,
        });
        const response = product.save();
        createProductPromises.push(response);
      });

      Promise.all(createProductPromises)
        .then((result) => {
          console.log(`CREATE PRODUCTS FOR ${shopid} SUCCESS`);
        })
        .catch((err) => console.log(err));
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
// exports.putAccom = [
//   authenticate,
//   async (req, res) => {
//     try {
//       let accom = await ShopModel.findById(req.body._id);
//       if (accom === null) {
//         return apiResponse.notFoundResponse(res, 'Object with id not found');
//       }
//       console.log(accom.owner._id);
//       console.log(req.user._id);
//       if (accom.owner._id != req.user._id) {
//         return apiResponse.unauthorizedResponse(
//           res,
//           'Not authorized to change this accom',
//         );
//       }
//       accom.name = req.body.name || accom.name;
//       accom.address = req.body.address || accom.address;
//       accom.description = req.body.description || accom.description;
//       accom.images = req.body.images || accom.images;
//       await accom.save();
//       return apiResponse.successResponseWithData(res, 'Updated', accom._id);
//     } catch (err) {
//       console.log(err);
//       return apiResponse.ErrorResponse(res, 'Internal error');
//     }
//   },
// ];
