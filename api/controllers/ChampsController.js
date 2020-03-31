/**
 * ChampController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  get: (req, res) => {
    Champ.find()
      .then(champs => {
        if (!champs || champs.length === 0) {
          return res.send({
            success: false,
            msg: 'No records found'
          });
        }
        return res.send({
          success: true,
          msg: 'Records fetched',
          data: champs
        });
      })
      .catch(err => {
        sails.log.debug(err);
        return res.send({
          success: false,
          msg: 'Unable to fetch records'
        });
      });
  },

  create: (req, res) => {
    sails.log.debug(req.body);
    Champ.create(req.body)
      .then(champ => {
        return res.send({
          success: true,
          message: 'Record create successfully'
        });
      })
      .catch(err => {
        sails.log.debug(err);
        return res.send({
          success: false,
          message: 'Unable to create record'
        });
      });
  },

  update: (req, res) => {
    sails.log.debug(req.params.id);
    Champ.update(req.params.id, req.allParams())
      .then(champ => {
        return res.send({
          success: true,
          message: 'Record Find successfully',
          data: champ
        });
      })
      .catch(err => {
        sails.log.debug(err)
        return res.send({
          success: false,
          message: 'Unable to update record'
        });
      });
  },

  delete: (req, res) => {
    sails.log.debug(req.params.id)
    Champ.destroy(req.params.id)
      .then(champ => {
        return res.send({
          success: true,
          message: 'Record deleted successfully',
          data: champ
        })
      })
      .catch(err => {
        sails.log.debug(err)
        return res.send({
          success: false,
          message: 'Cannot delete record'
        })
      })
  }
};
