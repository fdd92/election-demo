const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AdminMapper } = require('../model/admin');
const authConfig = require('../../config/auth');
const { BussErr } = require('../exception');

// 获取 jwt token
function generateToken(account) {
  return jwt.sign({ account }, authConfig.jwtSecret, { expiresIn: '2h' });
}

// 管理员登录
const login = async (account, password) => {
  const admin = await AdminMapper.findOne({
    where: {
      account,
    },
  });

  if (admin == null) {
    throw new BussErr('账号或密码错误。');
  }

  const validPassword = crypto.createHash('sha256').update(password + admin.salt).digest('hex');
  if (validPassword !== admin.pass) {
    throw new BussErr('账号或密码错误。');
  }

  return generateToken(admin.account);
};

module.exports = {
  login,
};
