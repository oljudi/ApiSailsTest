/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwt = require('jsonwebtoken');
const Emailaddresses = require('machinepack-emailaddresses');
const bcrypt = require('bcryptjs');

module.exports = {
  signup: (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.badRequest('An Email address is required');
    }
    if (!password) {
      return res.badRequest('A Password is required');
    }
    if (password.length < 8) {
      return res.badRequest('Password must be at least 8 characters.');
    }
    Emailaddresses.validate({
      string: email
    }).exec({
      error: err => {
        return res.serverError(err);
      },
      invalid: () => {
        return res.badRequest('Does not look like an email address');
      },
      success: async () => {
        // Call the helper create user (whit required or crash)
        const user = await sails.helpers.createUser.with({
          email: email,
          password: password
        });
        // Once the user is created this create the JWT
        const token = jwt.sign({ user: user.jwt }, sails.config.jwtSecret, {
          expiresIn: sails.config.jwtExpires
        });
        // Send Token to the cookies
        res.cookie('sailsjwt', token, {
          signed: true,
          expires: new Date(Date.now() + 900000),
          httpOnly: true
        });
        // Show in the token given and the succesfull status
        if (req.wantsJSON) {
          return res.send({
            success: true,
            message: 'User sucessfully created!',
            token: token
          });
        }
      }
    });
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.notFound();
    }

    await bcrypt.compare(password, user.password, (err, exit) => {
      if (err) {
        return res.serverError();
      }
      if (exit) {
        const token = jwt.sign({ user: user.jwt }, sails.config.jwtSecret, {
          expiresIn: sails.config.jwtExpires
        });
        res.cookie('sailsjwt', token, {
          signed: true,
          expires: new Date(Date.now() + 900000),
          httpOnly: true
        });
        if (req.wantsJSON) {
          return res.send({
            success: true,
            message: 'User logged && and JWT storage in a cookie'
          });
        }
      } else {
        return res.send({
          success: 'false',
          message: 'Password do not match'
        });
      }
    });
  },
  logout: (req, res) => {
    res.clearCookie('sailsjwt');
    req.user = null;
    return res.send({
      success: true,
      message: 'User logout, bai bai'
    });
  },
  check: (req, res) => {
    res.send({
      success: true,
      message: 'YES I PASS'
    })
  }
};
