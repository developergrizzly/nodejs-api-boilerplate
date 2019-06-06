import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      emailAddress: Joi.string().email().required(),
      mobileNumber: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      emailAddress: Joi.string()
        .email()
        .required()
        .label('Email address'),
      password: Joi.string()
        .required()
        .label('Password'),
    }
  },

  // POST /api/auth/register
  register: {
    body: {
      firstName: Joi.string()
        .when('loginType', { is: 'MANUAL', then: Joi.required() })
        .label('First name'),
      lastName: Joi.string()
        .when('loginType', { is: 'MANUAL', then: Joi.required() })
        .label('Last name'),
      emailAddress: Joi.string().email()
        .when('loginType', { is: 'MANUAL', then: Joi.required() })
        .label('Email address'),
      mobileNumber: Joi.string()
        .when('loginType', { is: 'MANUAL', then: Joi.required() })
        .description('Mobile number'),
      password: Joi.string()
        .when('loginType', { is: 'MANUAL', then: Joi.required() })
        .label('Password'),
      loginType: Joi.string().required()
        .label('Login type'),
      country: Joi.string()
        .when('loginType', { is: 'MANUAL', then: Joi.required() })
    }
  }
};
