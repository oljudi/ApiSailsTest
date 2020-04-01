const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  if (req.signedCookies.sailsjwt) {
    return jwt.verify(
      req.signedCookies.sailsjwt,
      sails.config.jwtSecret,
      async (err, payload) => {
        if (err || !payload.user) {
          return res.send({
            success: false,
            msg: 'Invalid token 1'
          });
        }
        const user = await User.findOne({ jwt: payload.user });
        if (!user) {
          res.send({
            success: false,
            msg: 'User not found'
          });
        }
        req.user = user;
        sails.log.debug(req.user);
        if (req.user) {
          return next();
        }
      }
    );
  } else {
    res.send({success: false,
      msg: 'Please login first'});
  }
};
