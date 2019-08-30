"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _joiPasswordComplexity = _interopRequireDefault(require("joi-password-complexity"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  successResponse,
  errorResponse
} = _utils.Helpers; // password complexity object

const complexityOptions = {
  min: 8,
  max: 250,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3
}; // TODO: create userValidation class

/**
   * This class holds all methods used for user validation
   * Functions:
   * 1) signup - validates user upon registration.
   * 2) dummy - a dummy method for testing validations upon success.
   */

class authValidation {
  /**
     * Validates user paramenters upon registration
     *
     * @param {object} userObject - The user object
     * @param {object} res - The user response object
     * @returns {object} - returns an object (error or response).
     */
  static async userSignup(userObject) {
    // joi parameters to test against user inputs
    const schema = {
      firstName: _joi.default.string().min(3).max(25).required().label('Please enter a valid firstname \n the field must not be empty and it must be more than 2 letters'),
      lastName: _joi.default.string().min(3).max(25).required().label('Please enter a valid lastname \n the field must not be empty and it must be more than 2 letters'),
      email: _joi.default.string().email().required().label('Please enter a valid company email address'),
      password: new _joiPasswordComplexity.default(complexityOptions).required().label('Password is required. \n It should be more than 8 characters, and should include at least a capital letter, and a number'),
      gender: _joi.default.string().valid('male', 'female').required().label('please input a gender (male or female'),
      street: _joi.default.string().min(2).max(20).required().label('Please input a street name'),
      city: _joi.default.string().min(3).max(25).required().label('Please input a city name'),
      state: _joi.default.string().min(3).max(25).required().label('Please input a state name'),
      country: _joi.default.string().min(3).max(50).required().label('Please input a country'),
      birthdate: _joi.default.date().iso().required().label('Please input a valid date format: yy-mm-dd'),
      phoneNumber: _joi.default.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).required().label('Please input a valid phone number'),
      companyName: _joi.default.string().min(3).max(40).required().label('Please add your company name')
    }; // Once user inputs are validated, move into server

    const {
      error
    } = _joi.default.validate({ ...userObject
    }, schema);

    if (error) {
      // throw errorResponse(res, { code: 400, message: error.details[0].context.label });
      throw error;
    }

    return true;
  }
  /**
     * Validates supplier paramenters upon registration
     *
     * @param {object} supplierObject - The supplier object
     * @param {object} res - The supplier response object
     * @returns {object} - returns an object (error or response).
     */


  static async supplierSignup(supplierObject) {
    const schema = {
      firstName: _joi.default.string().min(3).max(25).required().label('Please enter a valid firstname \n the field must not be empty and it must be more than 2 letters'),
      lastName: _joi.default.string().min(3).max(25).required().label('Please enter a valid lastname \n the field must not be empty and it must be more than 2 letters'),
      email: _joi.default.string().email().required().label('Please enter a valid company email address'),
      password: new _joiPasswordComplexity.default(complexityOptions).required().label('Password is required. \n It should be more than 8 characters, and should include at least a capital letter, and a number'),
      phoneNumber: _joi.default.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).required().label('Please input a valid phone number'),
      companyName: _joi.default.string().min(3).max(40).required().label('Please add your company name'),
      companyAddress: _joi.default.string().min(3).max(40).required().label('Please add your company address'),
      categoryOfServiceId: _joi.default.valid([1, 2]).required().label('Please enter a valid categoryOfServiceId')
    };

    const {
      error
    } = _joi.default.validate({ ...supplierObject
    }, schema);

    if (error) {
      throw error;
    }

    return true;
  }
  /**
   *  Dummy callback function for validation tests
   * Use this function as a placeholder for controllers
   * during testing of validations whenever the controller
   * being validated for is not yet implemented
   *
   * e.g: @ route:-
   * userRouter.post('/auth/signup', userValidation.signup, userValidation.dummy);
   * @param {object} req request from endpoint
   * @param {object} res - response of method
   * @return {object} - returns an object
   */


  static dummy(req, res) {
    try {
      // outdated response values, dummy parameter used for testing only
      successResponse(res, 'Success', 200);
    } catch (error) {
      const status = error.status || 500;
      errorResponse(res, {
        code: status,
        message: error.message
      });
    }
  }

}

exports.default = authValidation;