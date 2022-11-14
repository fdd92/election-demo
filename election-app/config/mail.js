module.exports = {
  host: process.env.MAIL_HOST, // 发送服务器
  port: process.env.MAIL_PORT, // 发送服务器端口
  user: process.env.MAIL_USER, // 邮箱用户名
  sendMail: process.env.MAIL_SEND_MAIL, // 邮件发送人邮箱
  pass: process.env.MAIL_PASSWORD, // 密码
};
