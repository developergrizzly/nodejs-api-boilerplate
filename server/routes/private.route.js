import express from 'express';
import config from '../../config/config';
import jwt from 'jsonwebtoken';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/', (req, res, next) => {
  let token= req.header("authorization").replace('Bearer ','');
  jwt.verify(token, config.jwtSecret, function(err, decoded) {
    if(err) {
      return next(new APIError('Unathorized request', httpStatus.UNAUTHORIZED, true));
    } else {
      let paylod=jwt.decode(token);
      req.userId=paylod._id;
    }
  });
  next();
});

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

export default router;
