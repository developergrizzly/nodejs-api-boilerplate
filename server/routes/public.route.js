import express from 'express';
import authRoutes from './auth.route';
import FileSystem from 'fs';

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.get('/access-log', (req, res) => {
  let filePath=`${__basedir}\\access-log.txt`;
  FileSystem.readFile(filePath, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.setHeader('Content-type', 'text/plain');
    res.send(data);
  });
});

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
