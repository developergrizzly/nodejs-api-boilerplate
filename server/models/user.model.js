import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import common from '../helpers/Common';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  emailAddress: {type: String, default: ''},
  password: {type: String, default: ''},
  isActive: {type:Boolean, default: true},
  isDeleted: {type:Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
}, {toObject: {virtuals: true}, toJSON: {virtuals: true}});

/**
 * Add your
 * - pre-save hooks
 * - pre-find hooks
 * - validations
 * - virtuals
 */

 /*

	UserSchema.pre('findById',  populateReferences)
		.pre('find', populateReferences);

	function populateReferences() {
		return this.populate('country');
	}

*/

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
