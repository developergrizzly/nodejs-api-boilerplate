import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/login')
  .post(authCtrl.login);

router.route('/register')
  .post(authCtrl.register);

export default router;
