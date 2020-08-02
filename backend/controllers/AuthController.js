const UserModel = require('../models/UserModel');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
//helper file to prepare responses.
const apiResponse = require('../helpers/apiResponse');
const utility = require('../helpers/utility');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('../helpers/mailer');
const { constants } = require('../helpers/constants');

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
  // Process request after validation and sanitization.
  (req, res) => {
    try {
      // Extract the validation errors from a request.
      // const errors = validationResult(req);
      //hash input password
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        // Create User object with escaped and trimmed data
        var user = new UserModel({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });
        user.save(function (err) {
          if (err) {
            return apiResponse.ErrorResponse(res, err);
          }
          let userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          };
          return apiResponse.successResponseWithData(
            res,
            'Registration Success.',
            userData,
          );
        });
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.login = [
  (req, res) => {
    try {
      bcrypt.hash(req.body.password, 10, function (err, hash) {});
      UserModel.findOne({ email: req.body.email }).then((user) => {
        if (user) {
          //Compare given password with db's hash.
          bcrypt.compare(req.body.password, user.password, function (
            err,
            same,
          ) {
            if (req.body.password == user.password) {
              let userData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
              };
              //Prepare JWT token for authentication
              const jwtPayload = userData;
              const jwtData = {
                expiresIn: process.env.JWT_TIMEOUT_DURATION,
              };
              const secret = process.env.JWT_SECRET;
              //Generated JWT token with Payload and secret.
              userData.token = jwt.sign(jwtPayload, secret, jwtData);
              return apiResponse.successResponseWithData(
                res,
                'Login Success.',
                userData,
              );
              // }
              // else{
              // 	return apiResponse.unauthorizedResponse(res, "Account is not confirmed. Please confirm your account.");
              // }
            } else {
              return apiResponse.unauthorizedResponse(
                res,
                'Email or Password wrong.',
              );
            }
          });
        } else {
          return apiResponse.unauthorizedResponse(
            res,
            'Email or Password wrong.',
          );
        }
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
