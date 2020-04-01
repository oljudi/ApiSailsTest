/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwt = require('jsonwebtoken');
const Emailaddresses = require('machinepack-emailaddresses');
const bcrypt = require('bcryptjs');

// const validator = require('email-validator');

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
    sails.log.debug(typeof email);
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
        // const user = await sails.helpers.createUser({
        //   email: email,
        //   password: password
        // });

        const attr = {
          jwtId: sails.helpers.randomCryptoString.with({ size: 32 }),
          email: email.toLowerCase()
        };
        if (password) {
          attr.password = await bcrypt.hash(password, 10);

          const user = await User.create(attr).fetch();
          const token = jwt.sign({ user: user.jwtId }, sails.config.jwtSecret, {
            expiresIn: sails.config.jwtExpires
          });
          res.cookie('sailsjwt', token, {
            signed: true,
            maxAge: 180 // WtF whit this shit - Should check this value
          });
          if (req.wantsJSON) {
            return res.ok(token);
          }
          return res.send({
            success: true,
            message: 'User successfully created!!'
          });
        }
      }
    });
  }
};
