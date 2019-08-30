"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _envConfig = _interopRequireDefault(require("../config/env-config"));

var _ApiError = _interopRequireDefault(require("./ApiError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  SECRET,
  PORT
} = _envConfig.default;
/**
 *Contains Helper methods
 *
 * @class Helpers
 */

class Helpers {
  /**
  *  Synchronously sign the given payload into a JSON Web Token string.
  * @static
  * @param {string | number | Buffer | object} payLoad Payload to sign.
  * @param {string | number} expiresIn Expressed in seconds or a string describing a
  * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 7days.
  * @memberof Helpers
  * @returns {string} JWT token.
  */
  static generateToken(payLoad, expiresIn = '7d') {
    return _jsonwebtoken.default.sign(payLoad, SECRET, {
      expiresIn
    });
  }
  /**
   *
   *  Synchronously verify the given JWT token using a secret
   * @static
   * @param {*} token - JWT token.
   * @returns {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   * @memberof Helpers
   */


  static verifyToken(token) {
    try {
      return _jsonwebtoken.default.verify(token, SECRET);
    } catch (err) {
      throw new Error('Invalid Token');
    }
  }
  /**
   * Generates email verification link
   * @static
   * @param { Request } req - Request object
   * @param { object } options - Contains user's data to be signed within Token.
   * @param { string } options.id - User's unique ID.
   * @param { string } options.email - User's email.
   * @param { string } options.role - User's role.
   * @memberof Helpers
   * @returns {URL} - Verification link.
   */


  static generateVerificationLink(req, {
    id,
    email,
    role
  }) {
    const token = Helpers.generateToken({
      id,
      email,
      role
    });
    const host = req.hostname === 'localhost' ? `${req.hostname}:${PORT}` : req.hostname;
    return `${req.protocol}://${host}/api/auth/verify?token=${token}`;
  }
  /**
  * Hashes a password
  * @static
  * @param {string} password - Password to encrypt.
  * @memberof Helpers
  * @returns {string} - Encrypted password.
  */


  static hashPassword(password) {
    return _bcryptjs.default.hashSync(password, _bcryptjs.default.genSaltSync(10));
  }
  /**
  * Compares a password with a given hash
  * @static
  * @param {string} password - Plain text password.
  * @param {string} hash - Encrypted password.
  * @memberof Helpers
  * @returns {boolean} - returns true if there is a match and false otherwise.
  */


  static comparePassword(password, hash) {
    return _bcryptjs.default.compareSync(password, hash);
  }
  /**
  * Generates a JSON response for success scenarios.
  * @static
  * @param {Response} res - Response object.
  * @param {object} data - The payload.
  * @param {number} code -  HTTP Status code.
  * @memberof Helpers
  * @returns {JSON} - A JSON success response.
  */


  static successResponse(res, data, code = 200) {
    return res.status(code).json({
      status: 'success',
      data
    });
  }
  /**
  * Generates a JSON response for failure scenarios.
  * @static
  * @param {Response} res - Response object.
  * @param {object} options - The payload.
  * @param {number} options.code -  HTTP Status code, default is 500.
  * @param {string} options.message -  Error message.
  * @param {object|array  } options.errors -  A collection of  error message.
  * @memberof Helpers
  * @returns {JSON} - A JSON failure response.
  */


  static errorResponse(res, {
    code = 500,
    message = 'Some error occurred while processing your Request',
    errors
  }) {
    return res.status(code).json({
      status: 'fail',
      error: {
        message,
        errors
      }
    });
  }
  /**
  * Extracts a new user object from the one supplied
  * @static
  * @param {object} user - The user data from which a new user object will be extracted.
  * @memberof Helpers
  * @returns { object } - The new extracted user object.
  */


  static extractUserData(user) {
    return {
      id: user.id,
      token: user.token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      street: user.street,
      city: user.city,
      state: user.state,
      country: user.country,
      bithdate: user.birthdate,
      phoneNumber: user.phoneNumber,
      companyName: user.companyName,
      supplierId: user.supplierId,
      isVerified: user.isVerified,
      role: user.role,
      department: user.department,
      lineManager: user.lineManager,
      preferredCurrency: user.preferredCurrency,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
  /**
  * Splits supplier object into comapany data and user data
  * @static
  * @param {object} supplierObject - The supplier object sent as request body.
  * @memberof Helpers
  * @returns { array } - An array containing both company data and user data.
  */


  static splitSupplierData(supplierObject) {
    const {
      companyName,
      companyAddress,
      categoryOfServiceId,
      firstName,
      lastName,
      email,
      password,
      phoneNumber
    } = supplierObject;
    const companyData = {
      companyName,
      companyAddress,
      categoryOfServiceId
    };
    const userData = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber
    };
    return [companyData, userData];
  }
  /**
  * Validates a value using the given Joi schema
  * @param {object} value
  * @param {Joi.SchemaLike} schema
  * @returns {Promise} Validation result
  */


  static validate(value, schema) {
    return _joi.default.validate(value, schema, {
      abortEarly: false,
      allowUnknown: true
    });
  }
  /**
  * Checks token from request header for user authentication
  * @param {object} req - The request from the endpoint
  * @returns {Token} Token
  */


  static checkToken(req) {
    const {
      authorization
    } = req.headers;

    if (!authorization) {
      throw new _ApiError.default(401, 'Access denied, Token required');
    }

    const token = req.headers.authorization.split(' ')[1] || req.headers.authorization || req.headers['x-access-token'] || req.headers.token || req.body.token;
    return token;
  }

}

var _default = Helpers;
exports.default = _default;