const AccomModel = require('../models/ShopModel');
const apiResponse = require('../helpers/apiResponse');
const mongoose = require('mongoose');
const authenticate = require('../middlewares/jwt');
const UserModel = require('../models/UserModel');
const e = require('express');
const ObjectId = mongoose.Types.ObjectId;
exports.getAll = [
  async (req, res) => {
    try {
      const accoms = await AccomModel.find({});
      return apiResponse.successResponseWithData(res, 'Success', accoms);
    } catch (err) {
      return apiResponse.ErrorResponse(res, 'Server problem');
    }
  },
];

exports.getOne = [
  async (req, res) => {
    try {
      var accomId = req.params.id;
      const accom = await AccomModel.findById(ObjectId(accomId));
      if (accom == null) {
        return apiResponse.notFoundResponse(
          res,
          `Accom with ${accomId} not found`,
        );
      }
      const owned = req.user._id === accom.owner._id;
      return apiResponse.successResponseWithData(res, 'Success', {
        accom: accom,
        owned: owned,
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, 'Unexpected Problem');
    }
  },
];

exports.postAccom = [
  authenticate,
  async (req, res) => {
    try {
      const accom = new AccomModel({
        name: req.body.name,
        address: req.body.address,
        description: req.body.description,
        owner: req.user._id,
        images: req.body.images,
      });
      await accom.save();
      const owner = UserModel.findById(req.user._id);
      owner.ownedAccoms.push(accom);
      await owner.save();
      return apiResponse.successResponseWithData(res, 'Created', accom._id);
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        const pattern = Object.keys(err.keyPattern)[0];
        return apiResponse.duplicateEntry(res, `${pattern} must be unique`);
      }
    }
  },
];

exports.putAccom = [
  authenticate,
  async (req, res) => {
    try {
      let accom = await AccomModel.findById(req.body._id);
      if (accom === null) {
        return apiResponse.notFoundResponse(res, 'Object with id not found');
      }
      console.log(accom.owner._id);
      console.log(req.user._id);
      if (accom.owner._id != req.user._id) {
        return apiResponse.unauthorizedResponse(
          res,
          'Not authorized to change this accom',
        );
      }
      accom.name = req.body.name || accom.name;
      accom.address = req.body.address || accom.address;
      accom.description = req.body.description || accom.description;
      accom.images = req.body.images || accom.images;
      await accom.save();
      return apiResponse.successResponseWithData(res, 'Updated', accom._id);
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, 'Internal error');
    }
  },
];
