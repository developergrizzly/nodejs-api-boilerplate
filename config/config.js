// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();
const envVars = process.env;

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  }
};

export default config;
