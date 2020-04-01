const jwt = require('jsonwebtoken');

//Middleware function
module.exports = async (req, res, next) => {
  //Ask if the cookie exists
  if (req.signedCookies.sailsjwt) {
    //verify token via .verify()
    return jwt.verify(
      req.signedCookies.sailsjwt,
      sails.config.jwtSecret,
      async (err, payload) => {
        // if there was an error
        if (err || !payload.user) {
          return res.send({
            success: false,
            msg: 'Invalid token 1'
          });
        }
        // if there is no error, find the user in the DB
        const user = await User.findOne({ jwt: payload.user });
        // if there is no user return a no user found
        if (!user) {
          return res.send({
            success: false,
            msg: 'User not found'
          });
        }
        // if the user exists in the DB, equal to req.user
        req.user = user;
        // then ask if req.user exists pass to the next accion
        if (req.user) {
          return next();
        }
      }
    );
  } else { // if the cookie dont exist inform the user to login first
    res.send({ success: false, msg: 'Please login first' });
  }
};
