const ShopModel = require('../models/ShopModel');
const apiResponse = require('../helpers/apiResponse');
const mongoose = require('mongoose');
const authenticate = require('../middlewares/jwt');
const UserModel = require('../models/UserModel');
const e = require('express');
const ObjectId = mongoose.Types.ObjectId;
// exports.getAll = [
//   async (req, res) => {
//     try {
//       const accoms = await ShopModel.find({});
//       return apiResponse.successResponseWithData(res, 'Success', accoms);
//     } catch (err) {
//       return apiResponse.ErrorResponse(res, 'Server problem');
//     }
//   },
// ];

// exports.getOne = [
//   async (req, res) => {
//     try {
//       var accomId = req.params.id;
//       const accom = await ShopModel.findById(ObjectId(accomId));
//       if (accom == null) {
//         return apiResponse.notFoundResponse(
//           res,
//           `Accom with ${accomId} not found`,
//         );
//       }
//       const owned = req.user._id === accom.owner._id;
//       return apiResponse.successResponseWithData(res, 'Success', {
//         accom: accom,
//         owned: owned,
//       });
//     } catch (err) {
//       return apiResponse.ErrorResponse(res, 'Unexpected Problem');
//     }
//   },
// ];

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
          coordinates: JSON.parse(req.body.coordinates),
        },
      });
      await shop.save();
      const owner = await UserModel.findById(req.user._id);
      console.log(owner.ownedShop);
      owner.ownedShop.push(shop);
      await owner.save();
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
