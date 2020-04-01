const bcrypt = require('bcryptjs')

module.exports = {


  friendlyName: 'Create user',


  description: 'Create a new User on the DB, hash the password',


  inputs: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    }

  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'The provide Email/Password are invalid'
    },
    emaiAlreadyInUse: {
      statusCode: 409,
      description: 'The provided Email is already in use',
    },

  },


  fn: async (inputs, exits) => {
    const attr = {
      jwt: sails.helpers.randomCryptoString.with({ size: 32 }),
      email: inputs.email.toLowerCase(),
    }
    if(inputs.password){
      attr.password = await bcrypt.hash(inputs.password, 10)

      const user = await User.create(attr)
        .intercept('E_UNIQUE', () => 'emaiAlreadyInUse')
        .intercept({name: 'usageError'}, () => 'invalid')
        .fetch()

      return exits.success(user)
    }
    else {
      return exits.invalid('Missing password')
    }
  }


};

