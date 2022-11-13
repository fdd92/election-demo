const { expressjwt: jwt } = require('express-jwt');
const authConfig = require('../../config/auth');

const isAuth = jwt({
  secret: authConfig.jwtSecret,
  algorithms: ['HS256'],
});

module.exports = isAuth;
