module.exports = async (req, res, next) => {
  await sails.helpers.verifyJwt.with(req, res).exec({
    error: err => res.serverError(err),
    invalid: err => {
      if (req.wantsJSON) {
        return res.sendStatus(401);
      }
      return res.send({
        success: false,
        msg: 'something went wrong',
        err
      });
    },
    success: () => next()
  });
};
