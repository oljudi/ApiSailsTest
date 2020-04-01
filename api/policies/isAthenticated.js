module.exports = async (req, res, next) => {
  await sails.helpers.verifyJwt(req, res).switch({
    error: err => res.serverError(err),
    invalid: err => {
      if (req.wantsJSON)
      {return res
          .status(401)
          .send({ success: false, msg: 'Error, please login first', error: err });}
      return res
        .status(401)
        .send({ success: false, msg: 'Error please login first', error: err });
    },
    success: () => next()
  });
};
