const Book = require('../models/BookModel');
const apiResponse = require('../helpers/apiResponse');
var mongoose = require('mongoose');
const authenticate = require('../middlewares/jwt');
const AccomModel = require('../models/ShopModel');
const UserModel = require('../models/UserModel');
mongoose.set('useFindAndModify', false);

// Book Schema
function BookData(data) {
  this.id = data._id;
  this.title = data.title;
  this.description = data.description;
  this.isbn = data.isbn;
  this.createdAt = data.createdAt;
}

exports.bookAccom = [
  authenticate,
  async (req, res) => {
    try {
      const accom = AccomModel.findById(req.body.id);
      if (accom.bookers.some((booker) => booker.equal(req.user._id))) {
        return apiResponse.duplicateEntry(res, 'User already booked');
      }
      if (accom.owner.equal(user._id)) {
        return apiResponse.unauthorizedResponse(
          res,
          'Cannot book your own accom',
        );
      }
      accom.bookers.push(req.user._id);
      await accom.save();
      const booker = UserModel.findById(req.user._id);
      booker.bookedAccoms.push(accom);
      await booker.save();
    } catch (err) {
      return apiResponse.ErrorResponse(res, 'Internal Error');
    }
  },
];
